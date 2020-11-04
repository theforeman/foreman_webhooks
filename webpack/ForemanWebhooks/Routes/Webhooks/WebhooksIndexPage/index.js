import React from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

import { callOnMount, callOnPopState } from 'foremanReact/common/HOC';
import { useForemanContext } from 'foremanReact/Root/Context/ForemanContext';

import WebhooksIndexPage from './WebhooksIndexPage';
import * as actions from '../WebhooksPageActions';

import {
  selectWebhooks,
  selectPage,
  selectPerPage,
  selectSearch,
  selectSort,
  selectHasData,
  selectHasError,
  selectIsLoading,
  selectSubtotal,
  selectMessage,
  selectCanCreate,
} from '../WebhooksPageSelectors';

const mapStateToProps = state => ({
  webhooks: selectWebhooks(state),
  page: selectPage(state),
  perPage: selectPerPage(state),
  search: selectSearch(state),
  sort: selectSort(state),
  isLoading: selectIsLoading(state),
  hasData: selectHasData(state),
  hasError: selectHasError(state),
  itemCount: selectSubtotal(state),
  message: selectMessage(state),
  canCreate: selectCanCreate(state),
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const callWithToastsContext = Component => props => {
  const { toasts } = useForemanContext();
  return <Component {...props} toasts={toasts} />;
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  callWithToastsContext,
  callOnMount(({ initializeWebhooks }) => initializeWebhooks()),
  callOnPopState(({ fetchWebhooks }) => fetchWebhooks())
)(WebhooksIndexPage);
