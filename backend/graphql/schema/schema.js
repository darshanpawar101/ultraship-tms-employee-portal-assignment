export const graphQLSchema = `#graphql
type Attendance {
  totalDays: Int!
  presentDays: Int!
  percentage: Float!
}

type User {
  _id: ID!
  name: String!
  username: String!
  role: String!
  avatar: String!
  gender: String!
  createdAt: String!
  updatedAt: String!
  dateOfBirth: String!
  age: Int
  className: String
  subjects: [String!]
  attendance: Attendance!
}

type AuthPayload {
  token: String!
  user: User!
}

type DeleteResponse {
  success: Boolean!
  message: String!
}

type PaginationInfo {
  total: Int!
  page: Int!
  limit: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPrevPage: Boolean!
}

type EmployeeListResponse {
  employees: [User!]!
  pagination: PaginationInfo!
}

input Filters {
  role: [String!]
  className: [String!]
  gender: [String!]
  maxAge: Int
  minAge: Int
}

input Sort {
  createdAt: Int
  age: Int
  name: Int
  className: Int
  attendance: Int
}

input Params {
  filters: Filters
  page: Int
  limit: Int
  sort: Sort
}

input NewUserDataParams {
  name: String!
  username: String!
  gender: String!
  password: String!
  role: String
  dateOfBirth: String!
  className: String
  subjects: [String!]
}

input UserDataParams {
  name: String
  username: String
  password: String
  role: String
  gender: String
  avatar: String
  dateOfBirth: String
  className: String
  subjects: [String!]
}

input AttendanceInput {
  totalDays: Int
  presentDays: Int
}

input LoginInput {
  username: String!
  password: String!
}

type EmployeesFiltersResponse {
  roles: [String]
  genders:  [String]
  classNames: [String]
}

type Query {

  getAllEmployees(params: Params): EmployeeListResponse!

  getEmployeesFilters:EmployeesFiltersResponse!
 
  getEmployeeById(id: ID!): User
 
  me: User
}

type Mutation {

  login(input: LoginInput!): AuthPayload!
  

  addNewUser(userData: NewUserDataParams!): User!
  

  updateUser(userId: ID!, userData: UserDataParams!): User!
  

  updateAttendance(userId: ID!, attendance: AttendanceInput!): User!
  

  deleteUser(userId: ID!): DeleteResponse!
}
`;
