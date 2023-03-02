let obj = {
    a: {
        aa: 1,
        ab: 2,
    },
    b: 2,
    c: 3,
};

// create a new object from obj but exclude a.ab
let { a: { aa }, ...rest } = obj;
console.log({ a: { aa }, ...rest }); // should log { a: { aa: 1 }, b: 2, c: 3 }
