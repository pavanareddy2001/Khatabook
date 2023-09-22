const initialState = {
  UserGSTIN: null,
  City: null,
  AddedDateTime: null,
  UpdatedBy: null,
  AddedBy: null,
  BusinessType: null,
  BusinessId: 1,
  Pincode: null,
  FlatBuiding: null,
  BusinessName: 'Finance Business',
  State: null,
  UpdatedDateTime: null,
  AddressArea: null,
  BusinessCategory: null,
};
const selectedBusinessReducer = (State = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_BUSINESSDATA':
      return action.payload;

    default:
      return State;
  }
};
export default selectedBusinessReducer;
