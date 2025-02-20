import React, { useEffect, useState } from "react";
import "./App.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState(""); 
  const [selectedFlag, setSelectedFlag] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryOptions = data.map((country) => ({
          flag: country.flags.svg,
          name: country.name.common,
          code: country.cca2,
          phoneCode:
            country.idd.root +
            (country.idd.suffixes ? country.idd.suffixes[0] : ""),
        }));

        setCountries(countryOptions);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    age: Yup.number()
      .min(18, "You must be at least 18 years old")
      .required("Age is required"),
    gender: Yup.string().required("Gender is required"),
    hobbies: Yup.array()
      .min(1, "Select at least one hobby")
      .required("Hobbies are required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone must contain only digits")
      .min(10, "Phone must be at least 10 digits")
      .required("Phone is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    age: "",
    gender: "",
    hobbies: [],
    country: "",
    phone: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);
    alert("Form submitted!");
    setSubmitting(false);
  };

  return (
    <div className="app">
      <h1>User Registration</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, isSubmitting, touched, errors }) => (
          <Form>
            {/* Name Field */}
            <div className="form-field">
              <label htmlFor="name">Name:</label>
              <Field
                type="text"
                id="name"
                name="name"
                className={touched.name && errors.name ? "input-error" : ""}
              />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email">Email:</label>
              <Field
                type="email"
                id="email"
                name="email"
                className={touched.email && errors.email ? "input-error" : ""}
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            {/* Age Field */}
            <div className="form-field">
              <label htmlFor="age">Age:</label>
              <Field
                type="number"
                min="0"
                id="age"
                name="age"
                className={touched.age && errors.age ? "input-error" : ""}
              />
              <ErrorMessage name="age" component="div" className="error" />
            </div>

            {/* Gender Field */}
            <div className="form-field">
              <label>Gender:</label>
              <div>
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    value="Male"
                    className={touched.gender && errors.gender ? "input-error" : ""}
                  /> Male
                </label>
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    value="Female"
                    className={touched.gender && errors.gender ? "input-error" : ""}
                  /> Female
                </label>
              </div>
              <ErrorMessage name="gender" component="div" className="error" />
            </div>

            {/* Hobbies Field */}
            <div className="form-field">
              <label>Hobbies:</label>
              <div>
                <label>
                  <Field
                    type="checkbox"
                    name="hobbies"
                    value="Reading"
                    className={touched.hobbies && errors.hobbies ? "input-error" : ""}
                  /> Reading
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="hobbies"
                    value="Traveling"
                    className={touched.hobbies && errors.hobbies ? "input-error" : ""}
                  /> Traveling
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="hobbies"
                    value="Gaming"
                    className={touched.hobbies && errors.hobbies ? "input-error" : ""}
                  /> Gaming
                </label>
              </div>
              <ErrorMessage name="hobbies" component="div" className="error" />
            </div>

            {/* Country Dropdown */}
            <div className="form-field">
              <label htmlFor="country">Country:</label>
              {loading ? (
                <p>Loading countries...</p>
              ) : (
                <Field
                  as="select"
                  id="country"
                  name="country"
                  className={touched.country && errors.country ? "input-error" : ""}
                  onChange={(e) => {
                    const selectedCountry = countries.find(
                      (c) => c.name === e.target.value
                    );
                    setFieldValue("country", e.target.value);
                    setSelectedPhoneCode(selectedCountry?.phoneCode || "");
                    setSelectedFlag(selectedCountry?.flag || "");
                  }}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </Field>
              )}
              <ErrorMessage name="country" component="div" className="error" />
            </div>

            {/* Phone Field */}
            <div className="form-field">
              <label htmlFor="phone">Phone:</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span>
                  {selectedPhoneCode ? (
                    <>
                      <img src={selectedFlag} style={{ width: '20px', height: 'auto', marginRight: '5px' }} alt="Flag" />
                      {selectedPhoneCode}
                    </>
                  ) : (
                    "Flag+Code"
                  )}
                </span>
                <Field
                  type="number"
                  min="0"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className={touched.phone && errors.phone ? "input-error" : ""}
                />
              </div>
              <ErrorMessage name="phone" component="div" className="error" />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
