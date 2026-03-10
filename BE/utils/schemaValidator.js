const { checkSchema } = require('express-validator');
// OR use JOI
const { State } = require('country-state-city');
const SLANG_WORDS = ["slang1","slang2","slang3","admin"];


//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Andaman and Nicobar Islands",
//   "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu",
//   "Delhi",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Lakshadweep",
//   "Puducherry",
// ];
 
const registrationSchema = checkSchema({
  username: {
    in: ['body'],
    isLength: {
      options: { min: 3 },
      errorMessage: 'Username must be at least 3 characters'
    },
    custom: {
      options: value => {
        // if (value.toLowerCase().includes('admin')) {
        //   throw new Error('Username "admin" is not allowed');
        // }
        if (value.toLowerCase().includes('admin') && SLANG_WORDS.some((ele)=> ele.toLowerCase() !== value.toLowerCase())){
          throw new Error('Username "admin" and restricted word should not be allowed');
        }
        return true;
      }
    }
  },

  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Invalid email format'
    }
  },
  password: {
    in: ['body'],
    custom: {
      options: value => {
        const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regex.test(value)) {
          throw new Error('Password must be at least 8 characters, include a number and an uppercase letter');
        }
        return true;
      }
    }
  },

  confirmPassword: {
    in: ['body'],
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }
    }
  },

  // Nested address object
  // "address.country": {
  //   in: ["body"],
  //   custom: {
  //     options: (value) => {
  //       if (value.trim().toLowerCase() !== "india") {
  //         throw new Error("Country must be India");
  //       }
  //       return true;
  //     },
  //   },
  // },

  // "address.state":{
  //     in:["body"],
  //     custom:{
  //           options:(value)=>{
  //                 if(!INDIAN_STATES.includes(value))
  //                 {
  //                       throw new Error('Invalid State');
  //                 }
  //                 return true;
  //           }
           
  //     }
  // },

  'address.country': {
    in: ['body'],
    custom: {
    options: value => {
        if (value.toLowerCase() !== 'india') {
          throw new Error('Only India is allowed as country');
        }
        return true;
      }
    }
  },
 
  'address.state': {
    in: ['body'],
    custom: {
    options: (value, { req }) => {
        if (req.body.address.country.toLowerCase() === 'india') {
          const states = State.getStatesOfCountry('IN');
          console.log("States:"+ states);
          if (!states.some(s => s.name === value)){
            throw new Error('Invalid state for India');
          }
        }
        return true;
      }
    }
  },

  'address.street': {
    in: ['body'],
    isString: true,
    notEmpty: {
      errorMessage: 'Street is required'
    }
  },

  'address.city': {
    in: ['body'],
    isString: true,
    notEmpty: {
      errorMessage: 'City is required'
    }
  },
  'address.zip': {
    in: ['body'],
    isPostalCode: {
      options: 'IN', // Use country code as needed
      errorMessage: 'Invalid ZIP code'
    }
  },

  // Nested preferences object
  // 'preferences.newsletter': {
  //   in: ['body'],
  //   isBoolean: {
  //     errorMessage: 'Newsletter preference must be true or false'
  //   },
  //   optional: true
  // },
  // 'preferences.topics': {
  //   in: ['body'],
  //   isArray: {
  //     errorMessage: 'Topics must be an array'
  //   },
  //   optional: true
  // },
  // 'preferences.topics.*': {
  //   in: ['body'],
  //   isString: {
  //     errorMessage: 'Each topic must be a string'
  //   }
  // }
});

module.exports = registrationSchema;