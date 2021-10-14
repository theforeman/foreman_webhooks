# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  class PreviewMockTest < ActiveSupport::TestCase
    let(:preview_mock) { ForemanWebhooks::Renderer::PreviewMock.new }

    def renderer
      @renderer ||= Foreman::Renderer::SafeModeRenderer
    end

    def scope(source)
      Class.new(WebhookTemplate.default_render_scope_class)
           .send(:new, source: source, variables: { object: preview_mock })
    end

    it 'handles method calls' do
      expected = '@object.some.weird {   }.sense?'
      result = preview_mock.some.weird(&:non).sense?
      assert_equal expected, result.to_s
    end

    it 'handles method calls with blocks' do
      expected = '@object.some.weird.sense? { |i| false }'
      result = preview_mock.some.weird.sense? { |i| !i.nil? }
      assert_equal expected, result.to_s

      expected = '@object.some.weird.sense? { |arr, i| arr.push(i.nil?) }'
      result = preview_mock.some.weird.sense? { |arr, i| arr.push(i.nil?) }
      assert_equal expected, result.to_s
    end

    it 'handles method calls with multiline blocks' do
      expected = 'h.name'
      content = '<% @object.each { |h| %>' \
                 '<%= h.name %>' \
                 '<% } %>'
      source = OpenStruct.new(content: content)

      assert_equal expected, renderer.render(source, scope(source))
    end

    it 'works with safe mode' do
      expected = '@object.some.weird.[](non).sense?'
      source = OpenStruct.new(content: '<%= @object.some.weird[:non].sense? %>')
      assert_equal expected, renderer.render(source, scope(source))
    end

    it 'safely works with safe mode' do
      expected = "Safemode doesn't allow to access 'block_pass' on"
      source = OpenStruct.new(content: '<%= @object.some.weird(&:non).sense? %>')

      exception = assert_raises Safemode::SecurityError do
        renderer.render(source, scope(source))
      end
      assert_include exception.message, expected
    end

    it 'safely works with instance_eval' do
      expected = '@object'
      source = OpenStruct.new(content: '<%= @object.instance_eval { exec "echo 5" } %>')

      assert_equal expected, renderer.render(source, scope(source))
    end

    it 'safely works with instance_exec' do
      expected = '@object'
      source = OpenStruct.new(content: '<%= @object.instance_exec { exec "echo 5" } %>')

      assert_equal expected, renderer.render(source, scope(source))
    end

    it 'safely works with instance_exec' do
      expected = '@object.__binding__.methods.send(eval, 1+1)'
      source = OpenStruct.new(content: '<%= @object.__send__(:__binding__).methods.send(:eval, "1+1") %>')

      assert_equal expected, renderer.render(source, scope(source))
    end
  end
end
