import React from 'react';
import PropTypes from 'prop-types';
import { Field as FormikField } from 'formik';
import {
  Spinner,
  InputGroup,
  InputGroupItem,
  TextArea,
  TextInput,
  Button,
  Icon,
  Checkbox,
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

import { filter } from 'lodash';

import { translate as __ } from 'foremanReact/common/I18n';

import FormField from 'foremanReact/components/common/forms/FormField';
import { default as PF5TypeAheadSelect } from 'foremanReact/components/common/forms/TypeAheadSelect';

const ForemanFormikField = ({
  name,
  type,
  required,
  label,
  labelHelp,
  inputSizeClass,
  labelSizeClass,
  rows,
  placeholder,
  options,
  isLoading,
  disabled,
  setDisabled,
}) => (
  <FormikField name={name}>
    {({
      field, // { name, value, onChange, onBlur }
      form: { touched, errors, setFieldValue, setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    }) => {
      const defaultSelection = (fieldValue, initialOptions) => {
        if (!fieldValue) return [];

        return filter(initialOptions, o => o.value === fieldValue);
      };
      const passwordInput = (
        <TextInput
          {...field}
          ouiaId={`input-password-${name}`}
          id={`input-password-${name}`}
          isRequired={required}
          isDisabled={disabled}
          placeholder={disabled ? '********' : ''}
          type="password"
        />
      );
      let content = null;

      switch (type) {
        case 'text':
          content = (
            <TextInput
              {...field}
              ouiaId={`input-text-${name}`}
              id={`input-text-${name}`}
              isRequired={required}
              isDisabled={disabled}
              placeholder={placeholder}
              type="text"
            />
          );
          break;
        case 'textarea':
          content = (
            <TextArea
              {...field}
              ouiaId={`input-textarea-${name}`}
              id={`input-textarea-${name}`}
              rows={rows}
              isRequired={required}
              isDisabled={disabled}
              placeholder={placeholder}
              autoResize
            />
          );
          break;
        case 'select':
          content = isLoading ? (
            <Spinner size="md" aria-label="loading icon" />
          ) : (
            <PF5TypeAheadSelect
              id={name}
              options={options}
              placeholder={__('Start typing to search')}
              selectedItem={defaultSelection(field.value, options)}
              onChange={selected =>
                setFieldValue(field.name, selected[0]?.value)
              }
            />
          );
          break;
        case 'password':
          content = setDisabled ? (
            <InputGroup>
              <InputGroupItem isFill>{passwordInput}</InputGroupItem>
              <InputGroupItem isFill>
                <Button
                  variant="control"
                  onClick={e => {
                    e.preventDefault();
                    setDisabled(!disabled);
                  }}
                  title={__('Change the password')}
                >
                  <Icon>
                    <PencilAltIcon />
                  </Icon>
                </Button>
              </InputGroupItem>
            </InputGroup>
          ) : (
            passwordInput
          );
          break;
        case 'checkbox':
          content = (
            <Checkbox
              {...field}
              id={`input-checkbox-${name}`}
              isChecked={field.value || ''}
            />
          );
          break;
        default:
          throw new Error('Unsupported input type.');
      }
      return (
        <FormField
          {...field}
          error={touched[name] ? errors[name] : undefined}
          type={type}
          inputSizeClass={inputSizeClass}
          labelSizeClass={labelSizeClass}
          required={required}
          label={label}
          labelHelp={labelHelp}
          options={options}
          id={`input-${type}-${name}`}
          isPF5
        >
          {content}
        </FormField>
      );
    }}
  </FormikField>
);

ForemanFormikField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  inputSizeClass: PropTypes.string,
  labelSizeClass: PropTypes.string,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
};

ForemanFormikField.defaultProps = {
  required: false,
  labelHelp: null,
  inputSizeClass: 'col-md-8',
  labelSizeClass: 'col-md-3',
  rows: 1,
  placeholder: '',
  options: null,
  isLoading: false,
  disabled: false,
  setDisabled: undefined,
};

export default ForemanFormikField;
