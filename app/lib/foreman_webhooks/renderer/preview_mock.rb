# frozen_string_literal: true

module ForemanWebhooks
  module Renderer
    class PreviewMock < BasicObject
      def initialize(name = '@object')
        @name = name
      end

      def method_missing(name, *args, &block)
        PreviewMock.new("#{@name}.#{build_signature(name, *args, &block)}")
      end

      def respond_to_missing?(_method_name, _include_private = false)
        true
      end

      def to_s
        @name
      end

      def to_jail
        self
      end

      def to_json(*_args)
        to_s
      end

      def as_json(*_args)
        to_s
      end

      def instance_eval
        to_s
      end

      def instance_exec
        to_s
      end

      def __send__(*args)
        method_missing(*args)
      end

      private

      def build_signature(name, *args, &block)
        signature = name.to_s
        signature += "(#{args.map(&:to_s).join(', ')})" unless args.empty?
        return signature unless block

        param_names = block.parameters.map { |p| p[1] }
        params = block.arity.positive? ? "|#{param_names.join(', ')}| " : ' '
        args = []
        0.upto(block.arity - 1) do |i|
          args << PreviewMock.new(block.parameters[i][1])
        end
        body = block.call(*args) unless args.empty?
        signature + " { #{params}#{body} }"
      end
    end
  end
end
