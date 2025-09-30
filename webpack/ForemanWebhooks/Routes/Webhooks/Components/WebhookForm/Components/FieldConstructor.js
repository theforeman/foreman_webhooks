import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  ExclamationCircleIcon,
  HelpIcon,
  PencilAltIcon,
} from '@patternfly/react-icons';
import {
  TextInput,
  Checkbox,
  Button,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Icon,
  TextArea,
  FormGroup,
  Popover,
  Grid,
  GridItem,
} from '@patternfly/react-core';

import AutocompleteInput from './AutocompleteInput';

const FormField = ({
  name,
  type,
  required,
  options,
  isLoading,
  validated,
  value,
  disabled,
  setValue,
  placeholder,
  errMsg,
  fieldId,
  ...props
}) => {
  const [fieldValidated, setFieldValidated] = useState('default');
  const [firstLoad, setFirstLoad] = useState(true);
  const [isDisabled, setIsDisabled] = useState(disabled);

  const requiredValidate = () => {
    if (firstLoad || !required) return;
    if (!value || value === '' || validated === 'error')
      setFieldValidated('error');
    else setFieldValidated('success');
  };

  const localHandler = (_event, newValue) => {
    setValue(name, newValue);
  };

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  useEffect(() => {
    requiredValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (type === 'checkbox') {
    return (
      <>
        <Checkbox
          ouiaId={name}
          id={fieldId ?? `id-${name}`}
          isChecked={value || false}
          onChange={(_, newValue) => {
            setValue(name, newValue);
          }}
          isDisabled={isLoading || isDisabled}
          isRequired={required}
          type={type}
          validated={fieldValidated}
        />
        <ValidationComponent localValidated={fieldValidated} errMsg={errMsg} />
      </>
    );
  } else if (type === 'textarea') {
    return (
      <>
        <TextArea
          rows={6}
          name={name}
          id={fieldId ?? `id-${name}`}
          value={value ?? ''}
          onChange={(_, newValue) => setValue(name, newValue)}
          isRequired={required}
          isDisabled={isLoading || isDisabled}
          type={type}
          validated={fieldValidated}
          placeholder={placeholder}
        />
        <ValidationComponent localValidated={fieldValidated} errMsg={errMsg} />
      </>
    );
  } else if (options.length !== 0) {
    return (
      <>
        <AutocompleteInput
          options={options}
          selected={value ?? ''}
          onSelect={newValue => setValue(name, newValue)}
          onChange={() => requiredValidate()}
          name={name}
          placeholder={placeholder}
          validationStatus={fieldValidated}
          validationMsg={errMsg}
          fieldId={fieldId}
        />
      </>
    );
  }
  return (
    <>
      {name === 'password' && (isDisabled || disabled) ? (
        <Grid hasGutter={false}>
          <GridItem span={11}>
            <TextInput
              name={name}
              value={value ?? ''}
              id={fieldId ?? `id-${name}`}
              onChange={localHandler}
              isDisabled={isLoading || isDisabled}
              isRequired={required}
              type={type}
              validated={fieldValidated}
              placeholder={placeholder}
              onBlur={requiredValidate}
              autoComplete="off"
            />
          </GridItem>
          <GridItem span={1}>
            <Button
              ouiaId={`reset-${name}`}
              onClick={() => setIsDisabled(false)}
              variant="control"
              icon={<PencilAltIcon />}
            />
          </GridItem>
        </Grid>
      ) : (
        <TextInput
          name={name}
          value={value ?? ''}
          id={fieldId ?? `id-${name}`}
          onChange={localHandler}
          isDisabled={isLoading || isDisabled}
          isRequired={required}
          type={type}
          validated={fieldValidated}
          placeholder={placeholder}
          onBlur={requiredValidate}
          autoComplete={type === 'password' ? 'new-password' : ''}
        />
      )}

      <ValidationComponent localValidated={fieldValidated} errMsg={errMsg} />
    </>
  );
};

const ValidationComponent = ({ localValidated, errMsg }) => (
  <>
    {localValidated === 'error' && (
      <FormHelperText>
        <HelperText>
          <HelperTextItem
            icon={
              <Icon>
                <ExclamationCircleIcon />
              </Icon>
            }
            variant={localValidated}
          >
            {errMsg ?? __('Field is required')}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    )}
  </>
);

const FieldConstructor = ({
  label,
  value,
  required,
  labelHelp,
  fieldId,
  name,
  ...props
}) => (
  <FormGroup
    isInline
    fieldId={fieldId ?? `id-${name}`}
    label={label}
    isRequired={required}
    labelIcon={
      labelHelp ? (
        <Popover
          bodyContent={
            typeof labelHelp === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: labelHelp }} />
            ) : (
              labelHelp
            )
          }
        >
          <Button
            ouiaId={`label-${label}`}
            type="button"
            variant="plain"
            onClick={e => e.preventDefault()}
          >
            <Icon>
              <HelpIcon />
            </Icon>
          </Button>
        </Popover>
      ) : (
        ''
      )
    }
  >
    <FormField
      value={value}
      required={required}
      name={name}
      {...props}
      fieldId={fieldId}
    />
  </FormGroup>
);

FieldConstructor.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  labelHelp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
  setValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
    PropTypes.number,
  ]),
  fieldId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FieldConstructor.defaultProps = {
  labelHelp: undefined,
  required: false,
  disabled: false,
  value: '',
  fieldId: undefined,
};

FormField.propTypes = {
  disabled: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  allowClear: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  validated: PropTypes.string,
  placeholder: PropTypes.string,
  errMsg: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  fieldId: PropTypes.string,
};

FormField.defaultProps = {
  label: '',
  errMsg: null,
  placeholder: '',
  validated: 'default',
  required: false,
  allowClear: false,
  options: [],
  isLoading: false,
  disabled: false,
  value: '',
  fieldId: undefined,
};

ValidationComponent.propTypes = {
  localValidated: PropTypes.string.isRequired,
  errMsg: PropTypes.string,
};

ValidationComponent.defaultProps = {
  errMsg: null,
};

export default FieldConstructor;
