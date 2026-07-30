export { Customer, CustomerAddress, CustomerPreferences, CustomerTag, CustomerNote } from './aggregates';
export type { CustomerPrimitives, CustomerAddressPrimitives, CustomerPreferencesPrimitives, CustomerTagPrimitives, CustomerNotePrimitives } from './aggregates';
export { CustomerId, CustomerName, CustomerStatus, CustomerSource, DocumentNumber, AddressId, CustomerTagId, CustomerNoteId } from './value-objects';
export type { CustomerStatusValue, CustomerSourceValue } from './value-objects';
export { CustomerException, CUSTOMER_ERROR_CODES } from './exceptions';
export {
  CustomerCreatedEvent, CustomerProfileUpdatedEvent, CustomerEmailChangedEvent,
  CustomerLinkedToUserEvent, GuestCustomerConvertedEvent, CustomerActivatedEvent,
  CustomerBlockedEvent, CustomerArchivedEvent, CustomerAddressAddedEvent,
  CustomerDefaultAddressChangedEvent, CustomerTagAssignedEvent, CustomerMetricsUpdatedEvent,
} from './events';
export { CUSTOMER_REPOSITORY, CUSTOMER_ADDRESS_REPOSITORY, CUSTOMER_TAG_REPOSITORY, CUSTOMER_NOTE_REPOSITORY } from './repositories';
export type { CustomerRepository, CustomerAddressRepository, CustomerTagRepository, CustomerNoteRepository, CustomerListFilters, CustomerListResult } from './repositories';
export type { UserReader, OrderReader, EventPublisher, Clock, CurrentActor } from './ports';
