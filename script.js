//==================================================
// ONLINE WELLNESS LEAVE APPLICATION
// GITHUB FRONT-END
//==================================================


//==================================================
// APPS SCRIPT WEB APP URL
//==================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzoDL-j7U4jTZPABnKTzJhZfr_nUOr1p_GM59xjdkEZz6ObYzUklFexiyhVgRk-eZbI/exec";


//==================================================
// GLOBAL VARIABLES
//==================================================

let isSubmitting = false;

let employeeVerified = false;


//==================================================
// API REQUEST
//==================================================

async function apiRequest(action, data = {}) {

  const response = await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },

    body: JSON.stringify({

      action: action,

      ...data

    })

  });


  if (!response.ok) {

    throw new Error(
      "Unable to connect to the Wellness Leave server."
    );

  }


  return await response.json();

}


//==================================================
// PAGE LOAD
//==================================================

window.onload = function () {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const dateFiled =
    document.getElementById("dateFiled");

  if (dateFiled) {
    dateFiled.value = today;
  }

  lockApplication();

  loadDistricts();

};


//==================================================
// LOCK APPLICATION
//==================================================

function lockApplication() {

  const applicationForm =
    document.getElementById("applicationForm");

  if (!applicationForm) return;

  applicationForm.classList.remove("unlocked");

  applicationForm.classList.add(
    "application-locked"
  );

}


//==================================================
// UNLOCK APPLICATION
//==================================================

function unlockApplication() {

  const applicationForm =
    document.getElementById("applicationForm");

  if (!applicationForm) return;

  applicationForm.classList.remove(
    "application-locked"
  );

  applicationForm.classList.add(
    "unlocked"
  );

}


//==================================================
// EMPLOYEE VERIFICATION
//==================================================

async function verifyEmployee() {

  const employeeID =
    document.getElementById("employeeID")
      .value
      .trim();

  const status =
    document.getElementById("employeeStatus");

  const employeeName =
    document.getElementById("employeeName");


  //==============================================
  // EMPTY EMPLOYEE NUMBER
  //==============================================

  if (!employeeID) {

    employeeVerified = false;

    employeeName.value = "";

    status.innerHTML = "";

    lockApplication();

    return;

  }


  //==============================================
  // LOCK WHILE CHECKING
  //==============================================

  employeeVerified = false;

  lockApplication();

  status.style.color = "#0B5ED7";

  status.innerHTML =
    "Checking employee...";


  try {

    const result =
      await apiRequest(
        "verifyEmployee",
        {
          employeeID: employeeID
        }
      );


    //============================================
    // VERIFIED
    //============================================

    if (result && result.success) {

      employeeName.value =
        result.name || "";

      status.style.color =
        "#198754";

      status.innerHTML =
        "✓ Employee verified";

      employeeVerified = true;

      unlockApplication();

    }


    //============================================
    // NOT VERIFIED
    //============================================

    else {

      employeeVerified = false;

      employeeName.value = "";

      status.style.color =
        "#dc3545";

      status.innerHTML =
        "✕ " +
        (
          result &&
          result.message
            ? result.message
            : "Employee Number not found."
        );

      lockApplication();

    }

  }

  catch (error) {

    employeeVerified = false;

    employeeName.value = "";

    status.style.color =
      "#dc3545";

    status.innerHTML =
      "Unable to verify employee.";

    lockApplication();

    console.error(error);

  }

}


//==================================================
// PREVENT CHANGING EMPLOYEE AFTER VERIFICATION
//==================================================

document.addEventListener(
  "input",
  function (e) {

    if (e.target.id === "employeeID") {

      if (employeeVerified) {

        employeeVerified = false;

        document.getElementById(
          "employeeName"
        ).value = "";

        document.getElementById(
          "employeeStatus"
        ).innerHTML = "";

        lockApplication();

      }

    }

  }
);


//==================================================
// OFFICE CHANGED
//==================================================

function officeChanged() {

  const office =
    document.getElementById("office").value;

  const districtGroup =
    document.getElementById("districtGroup");

  const schoolGroup =
    document.getElementById("schoolGroup");

  const employmentGroup =
    document.getElementById("employmentGroup");

  const district =
    document.getElementById("district");

  const school =
    document.getElementById("school");

  const employeeType =
    document.getElementById("employeeType");

  const position =
    document.getElementById("position");

  const relieverGroup =
    document.getElementById("relieverGroup");


  //==============================================
  // FIELD OFFICE
  //==============================================

  if (office === "Field Office") {

    districtGroup.style.display =
      "block";

    schoolGroup.style.display =
      "block";

    employmentGroup.style.display =
      "block";

  }


  //==============================================
  // DIVISION OFFICE
  //==============================================

  else {

    districtGroup.style.display =
      "none";

    schoolGroup.style.display =
      "none";

    employmentGroup.style.display =
      "none";

    relieverGroup.style.display =
      "none";


    district.selectedIndex = 0;

    school.innerHTML =
      '<option value="">Select School</option>';

    employeeType.selectedIndex = 0;

    position.innerHTML =
      '<option value="">Select Position</option>';

  }

}


//==================================================
// LOAD DISTRICTS
//==================================================

async function loadDistricts() {

  const district =
    document.getElementById("district");

  district.innerHTML =
    '<option value="">Loading...</option>';


  try {

    const response =
  await apiRequest(
    "getDistricts"
  );

const list =
  response.data || [];


    district.innerHTML =
      '<option value="">Select District</option>';


    if (Array.isArray(list)) {

      list.forEach(function (item) {

        district.innerHTML +=
          `<option value="${item}">${item}</option>`;

      });

    }

  }

  catch (error) {

    console.error(error);

    district.innerHTML =
      '<option value="">Unable to load districts</option>';

  }

}


//==================================================
// LOAD SCHOOLS
//==================================================

async function loadSchools() {

  const district =
    document.getElementById("district")
      .value;

  const school =
    document.getElementById("school");


  school.innerHTML =
    '<option value="">Loading...</option>';


  if (!district) {

    school.innerHTML =
      '<option value="">Select School</option>';

    return;

  }


  try {

    const response =
  await apiRequest(
    "getSchools",
    {
      district: district
    }
  );

const list =
  response.data || [];


    school.innerHTML =
      '<option value="">Select School</option>';


    if (Array.isArray(list)) {

      list.forEach(function (item) {

        school.innerHTML +=
          `<option value="${item}">${item}</option>`;

      });

    }

  }

  catch (error) {

    console.error(error);

    school.innerHTML =
      '<option value="">Unable to load schools</option>';

  }

}


//==================================================
// EMPLOYEE TYPE CHANGED
//==================================================

async function employeeTypeChanged() {

  const type =
    document.getElementById("employeeType")
      .value;

  const position =
    document.getElementById("position");

  const relieverGroup =
    document.getElementById("relieverGroup");


  position.innerHTML =
    '<option value="">Loading...</option>';


  if (!type) {

    position.innerHTML =
      '<option value="">Select Position</option>';

    relieverGroup.style.display =
      "none";

    return;

  }


  try {

    const response =
  await apiRequest(
    "getPositions",
    {
      employeeType: type
    }
  );

const list =
  response.data || [];


    position.innerHTML =
      '<option value="">Select Position</option>';


    if (Array.isArray(list)) {

      list.forEach(function (item) {

        position.innerHTML +=
          `<option value="${item}">${item}</option>`;

      });

    }

  }

  catch (error) {

    console.error(error);

    position.innerHTML =
      '<option value="">Unable to load positions</option>';

  }


  //==============================================
  // RELIEVER
  //==============================================

  if (type === "Teaching Personnel") {

    relieverGroup.style.display =
      "block";

  }

  else {

    relieverGroup.style.display =
      "none";

    document.getElementById(
      "relieverName"
    ).value = "";

    document.getElementById(
      "relieverPosition"
    ).value = "";

  }

}


//==================================================
// COMPUTE WORKING DAYS / LEAVE STATUS
//==================================================

async function computeWorkingDays() {

  const employeeID =
    document.getElementById("employeeID")
      .value
      .trim();

  const from =
    document.getElementById("dateFrom")
      .value;

  const to =
    document.getElementById("dateTo")
      .value;


  if (!employeeID || !from || !to) {

    document.getElementById(
      "workingDays"
    ).value = "";

    document.getElementById(
      "creditsUsed"
    ).value = "";

    document.getElementById(
      "balance"
    ).value = "";

    return;

  }


  try {

    const result =
      await apiRequest(
        "getLeaveStatus",
        {
          employeeID: employeeID,
          dateFrom: from,
          dateTo: to
        }
      );


    if (!result.success) {

      Swal.fire({

        icon: "warning",

        title: "Application Denied",

        text: result.message,

        confirmButtonColor:
          "#0B5ED7"

      });


      document.getElementById(
        "workingDays"
      ).value = "";

      document.getElementById(
        "creditsUsed"
      ).value = "";

      document.getElementById(
        "balance"
      ).value = "";

      return;

    }


    document.getElementById(
      "workingDays"
    ).value =
      result.workingDays;

    document.getElementById(
      "creditsUsed"
    ).value =
      result.creditsUsed;

    document.getElementById(
      "balance"
    ).value =
      result.balance;

  }

  catch (error) {

    console.error(error);

    Swal.fire({

      icon: "error",

      title: "System Error",

      text:
        "Unable to check your Wellness Leave balance.",

      confirmButtonColor:
        "#0B5ED7"

    });

  }

}


//==================================================
// REASON CHANGED
//==================================================

function reasonChanged() {

  const reason =
    document.getElementById("reason")
      .value;

  const otherGroup =
    document.getElementById(
      "otherReasonGroup"
    );


  if (reason === "Others") {

    otherGroup.style.display =
      "block";

  }

  else {

    otherGroup.style.display =
      "none";

    document.getElementById(
      "otherReason"
    ).value = "";

  }

}


//==================================================
// SUBMIT APPLICATION
//==================================================

async function submitApplication() {

  if (isSubmitting) {

    return;

  }


  //==============================================
  // EMPLOYEE VERIFICATION
  //==============================================

  if (!employeeVerified) {

    Swal.fire({

      icon: "warning",

      title: "Employee Not Verified",

      text:
        "Please enter a valid Employee Number and verify it first.",

      confirmButtonColor:
        "#0B5ED7"

    });

    return;

  }


  //==============================================
  // COLLECT VALUES
  //==============================================

  const employeeID =
    document.getElementById(
      "employeeID"
    ).value.trim();

  const office =
    document.getElementById(
      "office"
    ).value;

  const district =
    document.getElementById(
      "district"
    ).value;

  const school =
    document.getElementById(
      "school"
    ).value;

  const employeeType =
    document.getElementById(
      "employeeType"
    ).value;

  const position =
    document.getElementById(
      "position"
    ).value;

  const dateFrom =
    document.getElementById(
      "dateFrom"
    ).value;

  const dateTo =
    document.getElementById(
      "dateTo"
    ).value;

  const reasonSelect =
    document.getElementById(
      "reason"
    ).value;

  const otherReason =
    document.getElementById(
      "otherReason"
    ).value.trim();


  //==============================================
  // VALIDATION
  //==============================================

  if (!employeeID) {

    showValidation(
      "Please enter your Employee Number."
    );

    return;

  }


  if (!office) {

    showValidation(
      "Please select your Office."
    );

    return;

  }


  if (
    office === "Field Office" &&
    !district
  ) {

    showValidation(
      "Please select your District."
    );

    return;

  }


  if (
    office === "Field Office" &&
    !school
  ) {

    showValidation(
      "Please select your School."
    );

    return;

  }


  // Employee details are required ONLY
  // for Field Office.

  if (
    office === "Field Office" &&
    !employeeType
  ) {

    showIncomplete(
      "Please select your Type of Employee."
    );

    return;

  }


  if (
    office === "Field Office" &&
    !position
  ) {

    showValidation(
      "Please select your Position / Designation."
    );

    return;

  }


  if (!dateFrom || !dateTo) {

    showValidation(
      "Please select the Inclusive Dates."
    );

    return;

  }


  if (!reasonSelect) {

    showValidation(
      "Please select a reason for Wellness Leave."
    );

    return;

  }


  if (
    reasonSelect === "Others" &&
    !otherReason
  ) {

    showValidation(
      "Please specify your reason for Wellness Leave."
    );

    return;

  }


  //==============================================
  // FINAL REASON
  //==============================================

  const reason =
    reasonSelect === "Others"
      ? otherReason
      : reasonSelect;


  //==============================================
  // SUBMITTING STATE
  //==============================================

  isSubmitting = true;


  const btn =
    document.getElementById(
      "submitBtn"
    );


  btn.disabled = true;

  btn.innerHTML =
    "Submitting...";


  //==============================================
  // APPLICATION DATA
  //==============================================

  const data = {

    dateFiled:
      document.getElementById(
        "dateFiled"
      ).value,

    employeeID:
      employeeID,

    employeeName:
      document.getElementById(
        "employeeName"
      ).value,

    office:
      office,

    district:
      district,

    school:
      school,

    employeeType:
      employeeType,

    position:
      position,

    relieverName:
      document.getElementById(
        "relieverName"
      ).value.trim(),

    relieverPosition:
      document.getElementById(
        "relieverPosition"
      ).value.trim(),

    dateFrom:
      dateFrom,

    dateTo:
      dateTo,

    reason:
      reason

  };


  //==============================================
  // SEND TO APPS SCRIPT
  //==============================================

  try {

    const result =
      await apiRequest(
        "saveApplication",
        {
          data: data
        }
      );


    //============================================
    // SUCCESS
    //============================================

    if (
  result &&
  result.success
) {

  Swal.fire({

    icon: "success",

    title:
      "Application Submitted",

    text:
      "Your Wellness Leave application has been successfully submitted.",

    confirmButtonColor:
      "#0B5ED7",

    confirmButtonText:
      "OK"

  })
  .then(function () {

    resetApplicationForm();

  });

}

else {

  Swal.fire({

    icon: "error",

    title:
      "Unable to Submit",

    text:
      result.message ||
      "Unable to submit application.",

    confirmButtonColor:
      "#0B5ED7"

  });

  enableSubmitButton();

}
}

  //==============================================
  // CONNECTION ERROR
  //==============================================

  catch (error) {

    console.error(error);

    Swal.fire({

      icon: "error",

      title: "System Error",

      text:
        error.message ||
        "An unexpected error occurred.",

      confirmButtonColor:
        "#0B5ED7"

    });

    enableSubmitButton();

  }

}


//==================================================
// VALIDATION MESSAGE
//==================================================

function showValidation(message) {

  Swal.fire({

    icon: "warning",

    title: "Incomplete Application",

    text: message,

    confirmButtonColor:
      "#0B5ED7"

  });

}


//==================================================
// INCOMPLETE MESSAGE
//==================================================

function showIncomplete(message) {

  Swal.fire({

    icon: "warning",

    title: "Incomplete Application",

    text: message,

    confirmButtonColor:
      "#0B5ED7"

  });

}


//==================================================
// ENABLE SUBMIT BUTTON
//==================================================

function enableSubmitButton() {

  isSubmitting = false;

  const btn =
    document.getElementById(
      "submitBtn"
    );

  if (btn) {

    btn.disabled = false;

    btn.innerHTML =
      "Submit Application";

  }

}


//==================================================
// RESET APPLICATION FORM
//==================================================

function resetApplicationForm() {

  //==============================================
  // DATE FILED
  //==============================================

  document.getElementById(
    "dateFiled"
  ).value =
    new Date()
      .toISOString()
      .split("T")[0];


  //==============================================
  // EMPLOYEE
  //==============================================

  document.getElementById(
    "employeeID"
  ).value = "";

  document.getElementById(
    "employeeName"
  ).value = "";

  document.getElementById(
    "employeeStatus"
  ).innerHTML = "";


  employeeVerified = false;


  //==============================================
  // OFFICE
  //==============================================

  document.getElementById(
    "office"
  ).selectedIndex = 0;


  //==============================================
  // HIDE SECTIONS
  //==============================================

  document.getElementById(
    "districtGroup"
  ).style.display = "none";

  document.getElementById(
    "schoolGroup"
  ).style.display = "none";

  document.getElementById(
    "employmentGroup"
  ).style.display = "none";

  document.getElementById(
    "relieverGroup"
  ).style.display = "none";

  document.getElementById(
    "otherReasonGroup"
  ).style.display = "none";


  //==============================================
  // RESET DISTRICT / SCHOOL
  //==============================================

  document.getElementById(
    "district"
  ).selectedIndex = 0;

  document.getElementById(
    "school"
  ).innerHTML =
    '<option value="">Select School</option>';


  //==============================================
  // RESET EMPLOYMENT
  //==============================================

  document.getElementById(
    "employeeType"
  ).selectedIndex = 0;

  document.getElementById(
    "position"
  ).innerHTML =
    '<option value="">Select Position</option>';


  //==============================================
  // RESET RELIEVER
  //==============================================

  document.getElementById(
    "relieverName"
  ).value = "";

  document.getElementById(
    "relieverPosition"
  ).value = "";


  //==============================================
  // RESET DATES
  //==============================================

  document.getElementById(
    "dateFrom"
  ).value = "";

  document.getElementById(
    "dateTo"
  ).value = "";

  document.getElementById(
    "workingDays"
  ).value = "";

  document.getElementById(
    "creditsUsed"
  ).value = "";

  document.getElementById(
    "balance"
  ).value = "";


  //==============================================
  // RESET REASON
  //==============================================

  document.getElementById(
    "reason"
  ).selectedIndex = 0;

  document.getElementById(
    "otherReason"
  ).value = "";


  //==============================================
  // RESET SUBMIT
  //==============================================

  enableSubmitButton();

  lockApplication();

}
