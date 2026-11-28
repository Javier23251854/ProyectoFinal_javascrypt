
import fetchClient from './fetchClient';
import axiosClient from './axiosClient';
import xhrClient from './xhrClient';
import kyClient from './kyClient';
import alovaClient from './alovaClient';
import tanstackClient from './tanstackClient';
import swrClient from './swrClient';

// Lista centralizada de herramientas REST.
export const clients = [
  fetchClient,
  axiosClient,
  xhrClient,
  kyClient,
  alovaClient,
  tanstackClient,
  swrClient,
];
