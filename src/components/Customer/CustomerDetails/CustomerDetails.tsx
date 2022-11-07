import { FC } from "react";
import { useParams } from "react-router-dom";
import { InternalError } from "../../../pages/InternalError/InternalError";
import { NotFound } from "../../../pages/NotFound/NotFound";
import { getCustomer } from "../../../services/customers";
import {
  CustomerAttribute,
  ButtonEdit,
  SubTitle,
  Title,
  Wrapper,
  Background,
} from "./CustomerDetails.style";

type CustomerParams = {
  url: string;
};

export const CustomerDetails: FC = () => {
  const { url } = useParams<CustomerParams>();
  if (!url) {
    return <InternalError data-testid="internal-error-message" />;
  }
  const customer = getCustomer(url);
  if (!customer) {
    return <NotFound data-testid="not-found-message" />;
  }

  return (
    <Background>
      <Wrapper>
        <Title>Customer Details</Title>
        <SubTitle>Full Name: </SubTitle>
        <CustomerAttribute>{customer.name}</CustomerAttribute>
        <SubTitle>Address Line: </SubTitle>
        <CustomerAttribute>{customer.address}</CustomerAttribute>
        <SubTitle>Postcode: </SubTitle>
        <CustomerAttribute>{customer.postcode}</CustomerAttribute>
        <SubTitle>Telephone Number: </SubTitle>
        <CustomerAttribute>{customer.mainTelephone}</CustomerAttribute>
        <SubTitle>Additianl Telephone: </SubTitle>
        <CustomerAttribute>{customer.secondTelephone}</CustomerAttribute>
        <SubTitle>Email: </SubTitle>
        <CustomerAttribute>{customer.email}</CustomerAttribute>
        <ButtonEdit>Edit</ButtonEdit>
      </Wrapper>
    </Background>
  );
};
