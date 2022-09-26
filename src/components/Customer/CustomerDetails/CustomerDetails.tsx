import { FC } from "react";
import { useParams } from "react-router-dom";
import { NotFound } from "../../../pages/NotFound/NotFound";
import { getCustomer } from "../../../services/customers";
import {
  CustomerAttribute,
  Edit,
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
  const customer = getCustomer(url);

  return (
    <Background>
      <Wrapper>
        {customer ? (
          <>
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
          </>
        ) : (
          <NotFound />
        )}
        <Edit>Edit</Edit>
      </Wrapper>
    </Background>
  );
};
