import React from 'react';
import { checkoutInfo } from '@common/types/User';

const UserCheckouts = ({ checkouts }: { checkouts: checkoutInfo }) => {
  console.log(checkouts);
  return <div className="text-center">UserCheckouts</div>;
};

export default UserCheckouts;
