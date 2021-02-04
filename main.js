// AXIOS GLOBALS
axios.defaults.headers.common["X-Auth-Token"] =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// GET REQUEST
function getTodos() {
  console.log("GET Request");
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      params: { _limit: 10 },
    })
    .then((res) => showOutput(res))
    .catch(console.error());
}

// POST REQUEST
function addTodo() {
  console.log("POST Request");
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "Happy Chinese New Year",
      completed: false,
    })
    .then((res) => showOutput(res))
    .catch(console.error());
}

// PUT/PATCH REQUEST
function updateTodo() {
  console.log("PUT/PATCH Request");
  const postId = 23;
  axios
    .patch(`https://jsonplaceholder.typicode.com/todos/${postId}`, {
      title: "Happy Chinese New Year",
      completed: false,
    })
    .then((res) => showOutput(res))
    .catch(console.error());
}

// DELETE REQUEST
function removeTodo() {
  console.log("DELETE Request");
  const postId = 1;
  axios
    .delete(`https://jsonplaceholder.typicode.com/todos/${postId}`)
    .then((res) => showOutput(res))
    .catch(console.error());
}

// SIMULTANEOUS DATA
function getData() {
  console.log("Simultaneous Request");
  // --- MORE LENGHTY CODE ---
  // axios
  //   .all([
  //     axios.get("https://jsonplaceholder.typicode.com/todos/"),
  //     axios.get("https://jsonplaceholder.typicode.com/posts/"),
  //   ])
  //   .then((res) => {
  //     console.log(res[0]);
  //     console.log(res[1]);
  //     showOutput(res[1]);
  //   })
  //   .catch((err) => console.error());

  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos/", {
        params: { _limit: 5 },
      }),
      axios.get("https://jsonplaceholder.typicode.com/posts/", {
        params: { _limit: 5 },
      }),
    ])
    .then(axios.spread((todos, posts) => showOutput(todos)))
    .catch((err) => console.error());
}

// CUSTOM HEADERS
function customHeaders() {
  console.log("Custom Headers");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken",
    },
  };

  axios
    .post(
      `https://jsonplaceholder.typicode.com/todos/`,
      {
        title: "Happy Chinese New Year",
        completed: false,
      },
      config
    )
    .then((res) => showOutput(res))
    .catch(console.error());
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  console.log("Transform Response");
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos/",
    data: { title: "Helloworld." },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };

  axios(options).then((res) => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  console.log("Error Handling");
  axios
    .get("https://jsonplaceholder.typicode.com/todofs", {
      params: { _limit: 10 },
      validateStatus: function(status) {
        return status < 500; // reject only if status is greater or equal to 500
      }
    })
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        // Server responeded with a status other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
          alert("ERROR: Page not found");
        } else if (err.request) {
          // Request was made but no response
          console.error(err.request);
        } else {
          console.error(err.message);
        }
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  console.log("Cancel Token");

  const source = axios.CancelToken.source();
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      }
    });

  if (true) {
    source.cancel("Request cancelled!");
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  (config) => {
    console.log("config", config);
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES

const options = {
  params: {_limit: 5}
}

const anxioInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

anxioInstance.get("/comments", options).then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
