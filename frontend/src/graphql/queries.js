import { gql } from "@apollo/client";

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees($params: Params) {
    getAllEmployees(params: $params) {
      employees {
        _id
        name
        username
        role
        avatar
        gender
        age
        className
        subjects
        attendance {
          percentage
        }
      }
      pagination {
        total
        page
        limit
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_ALL_EMPLOYEES_FILTERS = gql`
  query Filter {
    getEmployeesFilters {
      roles
      genders
      classNames
    }
  }
`;
