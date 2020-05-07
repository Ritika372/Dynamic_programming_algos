const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();

//Content of all the problems.
const knap = "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. In other words, given two integer arrays val[0..n-1] and wt[0..n-1] which represent values and weights associated with n items respectively. Also given an integer W which represents knapsack capacity, find out the maximum value subset of val[] such that sum of the weights of this subset is smaller than or equal to W. You cannot break an item, either pick the complete item, or don’t pick it (0-1 property).";
const allpair = "The Floyd Warshall Algorithm is for solving the All Pairs Shortest Path problem. The problem is to find shortest distances between every pair of vertices in a given edge weighted directed Graph.";
const matrixchain = "Given a sequence of matrices, find the most efficient way to multiply these matrices together. The problem is not actually to perform the multiplications, but merely to decide in which order to perform the multiplications. Input: p[] = {40, 20, 30, 10, 30}   Output: 26000. There are 4 matrices of dimensions 40x20, 20x30, 30x10 and 10x30. Let the input 4 matrices be A, B, C and D.  The minimum number of multiplications are obtained by putting parenthesis in following way (A(BC))D --> 20*30*10 + 40*20*10 + 40*10*30";
const assembly = "A car factory has two assembly lines, each with n stations. A station is denoted by Si,j where i is either 1 or 2 and indicates the assembly line the station is on, and j indicates the number of the station. The time taken per station is denoted by ai,j. Each station is dedicated to some sort of work like engine fitting, body fitting, painting and so on. So, a car chassis must pass through each of the n stations in order before exiting the factory. The parallel stations of the two assembly lines perform the same task. After it passes through station Si,j, it will continue to station Si,j+1 unless it decides to transfer to the other line. Continuing on the same line incurs no extra cost, but transferring from line i at station j – 1 to station j on the other line takes time ti,j. Each assembly line takes an entry time ei and exit time xi which may be different for the two lines. Give an algorithm for computing the minimum time it will take to build a car chassis.";
const longest = "The Longest Increasing Subsequence (LIS) problem is to find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order. For example, the length of LIS for {10, 22, 9, 33, 21, 50, 41, 60, 80} is 6 and LIS is {10, 22, 33, 50, 60, 80}.";

//time complexities,
const tcknap = "The time complexity of this algorihtm is O(n*W), where n is number of items and W is the total capacity."
const tclong = "The time complexity of this algorithm is O(n^2), where n is the size of array."
const tcallpair = "The time complexity of this algorithm is O(V^3), where V is the number of vertices.";
const tcmatrix = "The time complexity of this algorithm is O(n^3), where n is the size of array.";
const tcassembly = "The time complexity of this algorithm is O(n), where n is the number of stations.";

let errormessage;
let out1;

//knapsack function
function knapsackprob(weight, value, capacity, size) {
  let dp = new Array(parseInt(capacity) + 1);
  dp.fill(0, 0, capacity + 1);
  for (let i = 0; i < size; i++) {
    for (let j = capacity; j >= weight[i]; j--) {
      if (dp[j] < value[i] + dp[j - weight[i]]) {
        dp[j] = value[i] + dp[j - weight[i]];
      }
    }
  }
  return dp[capacity];
}

//longest increaisng function
function longinc(size, arr) {
  let dp = new Array(parseInt(size));
  dp.fill(1, 0, size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        if (dp[i] < dp[j] + 1) {
          dp[i] = dp[j] + 1;
        }
      }
    }
  }
  let ans = 0;
  for (let i = 0; i < size; i++) {
    if (ans < dp[i]) {
      ans = dp[i];
    }
  }
  return ans;
}

//matrix chain multiplication function
function matrixproblem(n, p) {
  let m = new Array(n);
  for (let i = 0; i < n; i++) {
    m[i] = new Array(n);
  }
  let i, j, k, L, q;
  for (i = 0; i < n; i++) {
    m[i][i] = 0;
  }
  for (L = 2; L < n; L++) {
    for (i = 1; i < n - L + 1; i++) {
      j = i + L - 1;
      m[i][j] = 9999;
      for (k = i; k <= j - 1; k++) {
        q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (q < m[i][j]) {
          m[i][j] = q;
        }
      }
    }
  }
  return m[1][n - 1];
}

//all pair shortest path function
function allpairproblem(V, graph) {
  let dist = new Array(V);
  for (let i = 0; i < V; i++) {
    dist[i] = new Array(V);
  }

  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      dist[i][j] = graph[i][j];
    }
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      if (dist[i][j] >= 9999) {
        dist[i][j] = "INF";
      }
    }
  }
  return dist;
}

//assembly line function
function assemblyprogram(size, a, t, e, x) {
  let first = e[0] + a[0][0];
  let second = e[1] + a[1][0];

  for (let i = 1; i < size; i++) {
    let up = Math.min(first + a[0][i],
        second + t[1][i] + a[0][i]),
      down = Math.min(second + a[1][i],
        first + t[0][i] + a[1][i]);
    first = up;
    second = down;
  }

  first += x[0];
  second += x[1];

  return Math.min(first, second);
}

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//home route
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html");
});

//get requests of questions
app.get("/knapsack", function(req, res) {
  res.render("question", {
    questioname: knap,
    tc: tcknap,
    title: "0/1 Knapsack Problem"
  });
});

app.get("/longest", function(req, res) {
  res.render("question", {
    questioname: longest,
    tc: tclong,
    title: "Longest Increasing Subsequence"
  });
});

app.get("/assembly", function(req, res) {
  res.render("question", {
    questioname: assembly,
    tc: tcassembly,
    title: "Assembly Line Scheduling"
  });
});

app.get("/matrix", function(req, res) {
  res.render("question", {
    questioname: matrixchain,
    tc: tcmatrix,
    title: "Matrix Chain Multiplication"
  });
});

app.get("/allpair", function(req, res) {
  res.render("question", {
    questioname: allpair,
    tc: tcallpair,
    title: "All Pair Shortest Path"
  });
});

//get requests of outputs
app.get("/outputknap", function(req, res) {
  res.render("output", {
    out1: out1,
    title: "0/1 Knapsack",
    tc: tcknap
  });
});

app.get("/outputlong", function(req, res) {
  res.render("output", {
    out1: out1,
    title: "Longest Increasing Subsequence",
    tc: tclong
  });
});

app.get("/outputmatrix", function(req, res) {
  res.render("output", {
    out1: out1,
    title: "Matrix Chain Multiplication",
    tc: tcmatrix
  });
});

app.get("/outputallpair", function(req, res) {
  res.render("output", {
    out1: "{ " + out1 + " } ",
    title: "All Pair Shortest Path",
    tc: tcallpair
  });
});

app.get("/outputassembly", function(req, res) {
  res.render("output", {
    out1: out1,
    title: "Assembly Line Scheduling",
    tc: tcassembly
  });
});

//error get request
app.get("/error", function(req, res) {
  res.render("error", {
    error: errormessage
  });
});

//post request of all functions
app.post("/knapsack", function(req, res) {
  let size = req.body.size;
  let capacity = req.body.cap;
  let weight = [];
  let value = [];
  let textweight = req.body.weights;
  let textvalue = req.body.values;
  let j = 0;
  let cnt = 0;
  while (j < textweight.length) {
    let ten = 1;
    let wadd = 0;
    while (textweight[j] !== " " && j !== textweight.length) {
      if (parseInt(textweight[j]) < 0 || parseInt(textweight[j]) > 9) {
        errormessage = "knapsack";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(textweight[j]);
      ten = ten * 10;
      j++;
    }
    weight.push(wadd);
    cnt++;
    if (j < textweight.length) {
      j++;
    } else {
      break;
    }
  }
  if (cnt !== parseInt(size)) {
    errormessage = "knapsack";
    res.redirect("/error");
  }
  j = 0;
  cnt = 0;
  while (j < textvalue.length) {
    let ten = 1;
    let vadd = 0;
    while (textvalue[j] !== " " && j !== textvalue.length) {
      if (parseInt(textvalue[j]) < 0 || parseInt(textvalue[j]) > 9) {
        errormessage = "knapsack";
        res.redirect("/error");
      }
      vadd = vadd * ten + parseInt(textvalue[j]);
      ten = ten * 10;
      j++;
    }
    value.push(vadd);
    cnt++;
    if (j < textvalue.length) {
      j++;

    } else {
      break;
    }
  }

  if (cnt !== parseInt(size)) {
    errormessage = "knapsack";
    res.redirect("/error");
  }
  out1 = knapsackprob(weight, value, capacity, size);
  res.redirect("/outputknap");
});


app.post("/longest", function(req, res) {
  let size = req.body.size;
  let text = req.body.array;
  let longarray = [];
  let j = 0;
  let cnt = 0;
  while (j < text.length) {
    let ten = 1;
    let wadd = 0;
    while (text[j] !== " " && j !== text.length) {
      if (parseInt(text[j]) < 0 || parseInt(text[j]) > 9) {
        errormessage = "longest";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(text[j]);
      ten = ten * 10;
      j++;
    }
    longarray.push(wadd);
    cnt++;
    if (j < text.length) {
      j++;
    } else {
      break;
    }
  }
  if (cnt === parseInt(size)) {
    out1 = longinc(size, longarray);
    res.redirect("/outputlong");
  } else {
    errormessage = "longest";
    res.redirect("/error");
  }

});


app.post("/matrix", function(req, res) {
  let size = req.body.size;
  let text = req.body.array;
  let longarray = [];
  let j = 0;
  let cnt = 0;
  while (j < text.length) {
    let ten = 1;
    let wadd = 0;
    while (text[j] !== " " && j !== text.length) {
      if (parseInt(text[j]) < 0 || parseInt(text[j]) > 9) {
        errormessage = "matrix";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(text[j]);
      ten = ten * 10;
      j++;
    }
    longarray.push(wadd);
    cnt++;
    if (j < text.length) {
      j++;
    } else {
      break;
    }
  }
  if (cnt === parseInt(size)) {
    out1 = matrixproblem(size, longarray);
    res.redirect("/outputmatrix");
  } else {
    errormessage = "matrix";
    res.redirect("/error");
  }
});

app.post("/allpair", function(req, res) {
  let size = req.body.size;
  let text = req.body.array;
  let longarray = new Array(parseInt(size));
  for (let i = 0; i < parseInt(size); i++) {
    longarray[i] = new Array(parseInt(size));
  }
  let j = 0;
  let cnt = 0;
  let ii = 0,
    jj = -1;
  while (j < text.length) {
    let ten = 1;
    let wadd = 0;
    while (text[j] !== " " && j !== text.length) {
      if (text[j] === "^") {
        wadd = 9999;
        j++;
      } else if (parseInt(text[j]) < 0 || parseInt(text[j]) > 9) {
        errormessage = "allpair";
        res.redirect("/error");
      } else {
        wadd = wadd * ten + parseInt(text[j]);
        ten = ten * 10;
        j++;
      }
    }

    if (jj < parseInt(size - 1)) {
      jj++;
    } else {
      ii++;
      jj = 0;
    }
    longarray[ii][jj] = wadd;
    if (j < text.length) {
      j++;
    } else {
      break;
    }
  }

  out1 = allpairproblem(size, longarray);
  res.redirect("/outputallpair");

});


app.post("/assembly", function(req, res) {
  let size = req.body.size;
  let texta = req.body.a1;
  let textt = req.body.t1;
  let texte = req.body.e1;
  let textx = req.body.x1;
  let a = new Array(2);
  let t = new Array(2);
  let e = [];
  let x = [];

  for (let i = 0; i < 2; i++) {
    a[i] = new Array(parseInt(size));
    t[i] = new Array(parseInt(size));
  }

  let ii = 0,
    jj = -1;
  let j = 0;
  while (j < texta.length) {
    let ten = 1;
    let wadd = 0;
    while (texta[j] !== " " && j !== texta.length) {
      if (parseInt(texta[j]) < 0 || parseInt(texta[j]) > 9) {
        errormessage = "assembly";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(texta[j]);
      ten = ten * 10;
      j++;
    }

    if (jj < parseInt(size - 1)) {
      jj++;
    } else {
      ii++;
      jj = 0;
    }
    a[ii][jj] = wadd;
    if (j < texta.length) {
      j++;
    } else {
      break;
    }
  }

  j = 0;
  ii = 0, jj = -1;
  while (j < textt.length) {
    let ten = 1;
    let wadd = 0;
    while (textt[j] !== " " && j !== textt.length) {
      if (parseInt(textt[j]) < 0 || parseInt(textt[j]) > 9) {
        errormessage = "assembly";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(textt[j]);
      ten = ten * 10;
      j++;
    }
    if (jj < parseInt(size - 1)) {
      jj++;
    } else {
      ii++;
      jj = 0;
    }
    t[ii][jj] = wadd;
    if (j < textt.length) {
      j++;
    } else {
      break;
    }
  }

  j = 0;
  while (j < texte.length) {
    let ten = 1;
    let wadd = 0;
    while (texte[j] !== " " && j !== texte.length) {
      if (parseInt(texte[j]) < 0 || parseInt(texte[j]) > 9) {
        errormessage = "assembly";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(texte[j]);
      ten = ten * 10;
      j++;
    }
    e.push(wadd);
    if (j < texte.length) {
      j++;
    } else {
      break;
    }
  }

  j = 0;
  while (j < textx.length) {
    let ten = 1;
    let wadd = 0;
    while (textx[j] !== " " && j !== textx.length) {
      if (parseInt(textx[j]) < 0 || parseInt(textx[j]) > 9) {
        errormessage = "assembly";
        res.redirect("/error");
      }
      wadd = wadd * ten + parseInt(textx[j]);
      ten = ten * 10;
      j++;
    }
    x.push(wadd);
    if (j < textx.length) {
      j++;
    } else {
      break;
    }
  }
  let n = parseInt(size);
  if(x.length !== 2 || e.length !== 2){
    errormessage = "assembly";
    res.redirect("/error");
  }
  out1 = assemblyprogram(n, a, t, e, x);
  res.redirect("/outputassembly");
});


app.listen(3000, function() {
  console.log("server started on port 3000");
});
