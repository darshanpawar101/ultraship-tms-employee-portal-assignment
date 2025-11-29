import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        name
        role
        avatar
      }
    }
  }
`;

export const ADD_NEW_USER = gql`
  mutation AddNewUser($userData: NewUserDataParams!) {
    addNewUser(userData: $userData) {
      _id
      name
      username
      role
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $userData: UserDataParams!) {
    updateUser(userId: $userId, userData: $userData) {
      _id
      name
      username
      role
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;
