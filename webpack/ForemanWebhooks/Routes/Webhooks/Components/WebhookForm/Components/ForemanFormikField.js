import React from 'react';
import PropTypes from 'prop-types';
import { Field as FormikField } from 'formik';
import { Spinner } from '@patternfly/react-core';
import { TypeAheadSelect } from 'patternfly-react';
import { filter } from 'lodash';

import { translate as __ } from 'foremanReact/common/I18n';

import FormField from 'foremanReact/components/common/forms/FormField';

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
      let content = null;
      switch (type) {
        case 'textarea':
          content = (
            <textarea
              {...field}
              className="form-control"
              rows={rows}
              placeholder={placeholder}
            />
          );
          break;
        case 'select':
          content = isLoading ? (
            <Spinner size="md" aria-label="loading icon" />
          ) : (
            <TypeAheadSelect
              id={name}
              options={options}
              placeholder={__('Start typing to search')}
              selected={defaultSelection(field.value, options)}
              onChange={selected =>
                setFieldValue(field.name, selected[0]?.value)
              }
              // onBlur={e => setFieldTouched(field.name, true)}
            />
          );
          break;
        default:
          content = (
            <input
              {...field}
              type={type}
              checked={type === 'checkbox' ? field.value || '' : undefined}
              className={type === 'checkbox' ? '' : 'form-control'}
            />
          );
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
  labelHelp: PropTypes.string,
  inputSizeClass: PropTypes.string,
  labelSizeClass: PropTypes.string,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  isLoading: PropTypes.bool,
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
};

export default ForemanFormikField;
