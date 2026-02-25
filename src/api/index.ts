/**
 * o8 API Module
 * Unified Identity API for Creative Identity Protocol
 */

export {
  IdentityService,
  InMemoryIdentityStore,
  createRouteHandlers,
  type IdentityStore,
  type IdentityFilters,
  type ExternalDNASources,
  type IdentityServiceConfig,
  type RouteHandler,
} from './identity.js';

export {
  createProvenanceRouteHandlers,
  type ProvenanceAPIConfig,
} from './provenance.js';
