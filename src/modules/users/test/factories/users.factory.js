

export const usersMock = [
  {
    id: '1',
    name: "Dedaldino",
    email: "dedaldinodev4@gmail.com"
  },
  {
    id: '4',
    name: "Daniel",
    email: "danielmjs@gmail.com"
  }
]

export function createResponseFake() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    ended: false,

    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      this.headers = headers;
    },

    end(body) {
      this.body = body;
      this.ended = true;
    }
  }
}



export function createRequestFake(body) {
  return {
    async json() {
      return body;
    }
  };
}