

export function userServiceMock() {
  return {
    getById: async () => null,
    getByEmail: async () => null,
    getByEmailWithPassword: async () => null,
    gelAllUsers: async () => ({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    }),
    update: async (id, data) => ({
      id,
      ...data
    }),
    delete: async () => {}
  };
}