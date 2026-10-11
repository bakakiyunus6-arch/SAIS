/* =====================================================
   STUDENT ATTENDANCE INFORMATION SYSTEM
   FINAL VERSION 5.0
   RAD PROTOTYPE
===================================================== */


/* =====================================================
   USER ACCOUNTS
===================================================== */

const users = [

    {
        username: "admin",
        password: "1234",
        role: "admin",
        name: "Administrator"
    },

    {
        username: "teacher",
        password: "1234",
        role: "teacher",
        name: "Class Teacher"
    },

    {
        username: "student",
        password: "1234",
        role: "student",
        name: "John Doe",
        studentId: "STU001"
    }

];


let currentUser = null;


/* =====================================================
   DEFAULT STUDENTS
===================================================== */

const defaultStudents = [

    {
        id: "STU001",
        name: "John Doe",
        programme: "Bachelor of Information Technology",
        year: "Year 1"
    },

    {
        id: "STU002",
        name: "Mary Nakato",
        programme: "Bachelor of Business Administration",
        year: "Year 2"
    },

    {
        id: "STU003",
        name: "David Okello",
        programme: "Bachelor of Computer Science",
        year: "Year 1"
    }

];


/* =====================================================
   DATA
===================================================== */

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || defaultStudents;


let attendance =
    JSON.parse(
        localStorage.getItem("attendance")
    ) || [];


let selectedProfileStudentId = null;


/* =====================================================
   DOM
===================================================== */

const loginPage =
    document.getElementById("loginPage");

const systemPage =
    document.getElementById("systemPage");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const studentForm =
    document.getElementById("studentForm");

const studentSearch =
    document.getElementById("studentSearch");

const recordSearch =
    document.getElementById("recordSearch");

const profileSearch =
    document.getElementById("profileSearch");

const attendanceDate =
    document.getElementById("attendanceDate");

const attendancePanel =
    document.getElementById("attendancePanel");

const attendanceList =
    document.getElementById("attendanceList");

const recordStatusFilter =
    document.getElementById(
        "recordStatusFilter"
    );

const recordFromDate =
    document.getElementById(
        "recordFromDate"
    );

const recordToDate =
    document.getElementById(
        "recordToDate"
    );


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const user =
            users.find(
                account =>
                    account.username === username &&
                    account.password === password
            );


        if (!user) {

            loginMessage.textContent =
                "Invalid username or password.";

            loginMessage.style.color =
                "#dc2626";

            return;

        }


        currentUser = user;


        loginPage.classList.add(
            "hidden"
        );

        systemPage.classList.remove(
            "hidden"
        );


        setupUserInterface();

        initializeSystem();

    }
);


/* =====================================================
   USER INTERFACE
===================================================== */

function setupUserInterface() {

    document.getElementById(
        "userName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "userRole"
    ).textContent =
        capitalize(currentUser.role);


    document.getElementById(
        "userAvatar"
    ).textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();


    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    buttons.forEach(
        button => {

            const section =
                button.getAttribute(
                    "data-section"
                );


            if (
                currentUser.role === "admin"
            ) {

                button.style.display =
                    "block";

            }


            else if (
                currentUser.role === "teacher"
            ) {

                const allowed = [

                    "dashboard",
                    "attendance",
                    "records",
                    "reports"

                ];


                button.style.display =
                    allowed.includes(section)
                        ? "block"
                        : "none";

            }


            else {

                const allowed = [

                    "dashboard",
                    "records"

                ];


                button.style.display =
                    allowed.includes(section)
                        ? "block"
                        : "none";

            }

        }
    );


    document.querySelector(
        ".welcome h1"
    ).textContent =
        "Welcome, " +
        currentUser.name +
        " 👋";

}


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener(
    "click",
    function() {

        currentUser = null;

        systemPage.classList.add(
            "hidden"
        );

        loginPage.classList.remove(
            "hidden"
        );

        loginForm.reset();

        loginMessage.textContent = "";

    }
);


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-btn")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    showSection(
                        this.getAttribute(
                            "data-section"
                        )
                    );

                }
            );

        }
    );


function showSection(sectionName) {

    document
        .querySelectorAll(".content-section")
        .forEach(
            section =>
                section.classList.remove(
                    "active-section"
                )
        );


    const section =
        document.getElementById(
            sectionName
        );


    if (!section) {
        return;
    }


    section.classList.add(
        "active-section"
    );


    document
        .querySelectorAll(".nav-btn")
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );


                if (
                    button.getAttribute(
                        "data-section"
                    ) === sectionName
                ) {

                    button.classList.add(
                        "active"
                    );

                }

            }
        );


    if (
        sectionName === "dashboard"
    ) {
        updateDashboard();
    }

    if (
        sectionName === "students"
    ) {
        renderStudents();
    }

    if (
        sectionName === "records"
    ) {
        renderRecords();
    }

    if (
        sectionName === "reports"
    ) {
        updateReports();
    }

}


/* =====================================================
   STUDENT CRUD
===================================================== */

studentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            document
                .getElementById("studentId")
                .value
                .trim()
                .toUpperCase();


        const name =
            document
                .getElementById("studentName")
                .value
                .trim();


        const programme =
            document
                .getElementById("studentProgramme")
                .value
                .trim();


        const year =
            document
                .getElementById("studentYear")
                .value;


        const editId =
            document
                .getElementById("editStudentId")
                .value;


        if (
            !id ||
            !name ||
            !programme ||
            !year
        ) {

            showStudentMessage(
                "Please complete all fields.",
                "error"
            );

            return;

        }


        /* UPDATE */

        if (editId) {

            const index =
                students.findIndex(
                    student =>
                        student.id === editId
                );


            if (index === -1) {
                return;
            }


            const duplicate =
                students.some(
                    student =>
                        student.id === id &&
                        student.id !== editId
                );


            if (duplicate) {

                showStudentMessage(
                    "Student ID already exists.",
                    "error"
                );

                return;

            }


            attendance =
                attendance.map(
                    record => {

                        if (
                            record.studentId === editId
                        ) {

                            record.studentId = id;

                        }

                        return record;

                    }
                );


            students[index] = {

                id,
                name,
                programme,
                year

            };


            saveData();

            resetStudentForm();

            renderStudents();

            renderRecords();

            updateDashboard();

            updateReports();


            showStudentMessage(
                "Student updated successfully.",
                "success"
            );


            return;

        }


        /* CREATE */

        const exists =
            students.some(
                student =>
                    student.id === id
            );


        if (exists) {

            showStudentMessage(
                "Student ID already exists.",
                "error"
            );

            return;

        }


        students.push({

            id,
            name,
            programme,
            year

        });


        saveData();

        studentForm.reset();

        renderStudents();

        updateDashboard();

        updateReports();


        showStudentMessage(
            "Student added successfully.",
            "success"
        );

    }
);


/* =====================================================
   RENDER STUDENTS
===================================================== */

function renderStudents() {

    const tbody =
        document.getElementById(
            "studentTableBody"
        );


    const search =
        studentSearch.value
            .toLowerCase()
            .trim();


    const filtered =
        students.filter(
            student =>

                student.id
                    .toLowerCase()
                    .includes(search)

                ||

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.programme
                    .toLowerCase()
                    .includes(search)

                ||

                student.year
                    .toLowerCase()
                    .includes(search)

        );


    tbody.innerHTML = "";


    if (!filtered.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7">
                    No students found.
                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        (student, index) => {

            const records =
                attendance.filter(
                    record =>
                        record.studentId ===
                        student.id
                );


            const present =
                records.filter(
                    record =>
                        record.status ===
                        "Present"
                ).length;


            const rate =
                records.length
                    ? Math.round(
                        present /
                        records.length *
                        100
                    )
                    : 0;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(student.id)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.programme)}
                </td>

                <td>
                    ${escapeHTML(student.year)}
                </td>

                <td>
                    ${rate}%
                </td>

                <td>

                    <button
                        class="view-btn"
                        onclick="viewStudent('${escapeAttribute(student.id)}')"
                    >
                        👁 View
                    </button>

                    ${
                        currentUser &&
                        currentUser.role === "admin"
                        ?

                        `

                        <button
                            class="edit-btn"
                            onclick="editStudent('${escapeAttribute(student.id)}')"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent('${escapeAttribute(student.id)}')"
                        >
                            🗑 Delete
                        </button>

                        `

                        : ""

                    }

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


studentSearch.addEventListener(
    "input",
    renderStudents
);


/* =====================================================
   STUDENT PROFILE
===================================================== */

function viewStudent(id) {

    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student) {
        return;
    }


    selectedProfileStudentId =
        student.id;


    document.getElementById(
        "profileAvatar"
    ).textContent =
        student.name
            .charAt(0)
            .toUpperCase();


    document.getElementById(
        "profileName"
    ).textContent =
        student.name;


    document.getElementById(
        "profileProgramme"
    ).textContent =
        student.programme;


    document.getElementById(
        "profileId"
    ).textContent =
        student.id;


    document.getElementById(
        "profileProgrammeCard"
    ).textContent =
        student.programme;


    document.getElementById(
        "profileYear"
    ).textContent =
        student.year;


    profileSearch.value = "";


    renderProfileAttendance();

    showSection("profile");

}


/* =====================================================
   PROFILE ATTENDANCE
===================================================== */

function renderProfileAttendance() {

    if (!selectedProfileStudentId) {
        return;
    }


    const tbody =
        document.getElementById(
            "profileAttendanceBody"
        );


    const allRecords =
        attendance.filter(
            record =>
                record.studentId ===
                selectedProfileStudentId
        );


    const present =
        allRecords.filter(
            record =>
                record.status ===
                "Present"
        ).length;


    const absent =
        allRecords.filter(
            record =>
                record.status ===
                "Absent"
        ).length;


    const total =
        allRecords.length;


    const rate =
        total
            ? Math.round(
                present /
                total *
                100
            )
            : 0;


    document.getElementById(
        "profileTotal"
    ).textContent = total;


    document.getElementById(
        "profilePresent"
    ).textContent = present;


    document.getElementById(
        "profileAbsent"
    ).textContent = absent;


    document.getElementById(
        "profileRate"
    ).textContent =
        rate + "%";


    const search =
        profileSearch.value
            .toLowerCase()
            .trim();


    const records =
        allRecords
            .filter(
                record =>

                    formatDate(record.date)
                        .toLowerCase()
                        .includes(search)

                    ||

                    record.status
                        .toLowerCase()
                        .includes(search)

            )
            .sort(
                (a,b) =>
                    b.date.localeCompare(
                        a.date
                    )
            );


    tbody.innerHTML = "";


    if (!records.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="2">
                    No attendance records found.
                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(record.date)}
                </td>

                <td>
                    <span class="${
                        record.status ===
                        "Present"
                            ? "status-present"
                            : "status-absent"
                    }">

                        ${escapeHTML(record.status)}

                    </span>
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


profileSearch.addEventListener(
    "input",
    renderProfileAttendance
);


/* =====================================================
   EDIT STUDENT
===================================================== */

function editStudent(id) {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {
        return;
    }


    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student) {
        return;
    }


    document.getElementById(
        "editStudentId"
    ).value =
        student.id;


    document.getElementById(
        "studentId"
    ).value =
        student.id;


    document.getElementById(
        "studentName"
    ).value =
        student.name;


    document.getElementById(
        "studentProgramme"
    ).value =
        student.programme;


    document.getElementById(
        "studentYear"
    ).value =
        student.year;


    document.getElementById(
        "studentFormTitle"
    ).textContent =
        "Edit Student";


    document.getElementById(
        "studentSubmitBtn"
    ).textContent =
        "💾 Update Student";


    document.getElementById(
        "cancelEditBtn"
    ).classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   DELETE STUDENT
===================================================== */

function deleteStudent(id) {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {
        return;
    }


    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student) {
        return;
    }


    const confirmed =
        confirm(
            "Delete " +
            student.name +
            "?\n\n" +
            "All attendance records for this student will also be deleted."
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(
            item =>
                item.id !== id
        );


    attendance =
        attendance.filter(
            record =>
                record.studentId !== id
        );


    saveData();

    renderStudents();

    renderRecords();

    updateDashboard();

    updateReports();

}


/* =====================================================
   RESET STUDENT FORM
===================================================== */

document
    .getElementById("cancelEditBtn")
    .addEventListener(
        "click",
        resetStudentForm
    );


function resetStudentForm() {

    studentForm.reset();


    document.getElementById(
        "editStudentId"
    ).value = "";


    document.getElementById(
        "studentFormTitle"
    ).textContent =
        "Add New Student";


    document.getElementById(
        "studentSubmitBtn"
    ).textContent =
        "➕ Add Student";


    document.getElementById(
        "cancelEditBtn"
    ).classList.add(
        "hidden"
    );

}


/* =====================================================
   ATTENDANCE
===================================================== */

function todayString() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


attendanceDate.value =
    todayString();


document
    .getElementById("loadAttendanceBtn")
    .addEventListener(
        "click",
        loadAttendance
    );


function loadAttendance() {

    const date =
        attendanceDate.value;


    if (!date) {

        showAttendanceMessage(
            "Please select a date.",
            "error"
        );

        return;

    }


    attendancePanel.classList.remove(
        "hidden"
    );


    document.getElementById(
        "selectedAttendanceDate"
    ).textContent =
        formatDate(date);


    attendanceList.innerHTML = "";


    students.forEach(
        student => {

            const existing =
                attendance.find(
                    record =>
                        record.studentId ===
                            student.id &&
                        record.date ===
                            date
                );


            const status =
                existing
                    ? existing.status
                    : "Present";


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "attendance-row";


            row.innerHTML = `

                <div class="attendance-student">

                    <strong>
                        ${escapeHTML(student.name)}
                    </strong>

                    <span>
                        ${escapeHTML(student.id)}
                        •
                        ${escapeHTML(student.programme)}
                    </span>

                </div>


                <select
                    class="attendance-select"
                    data-student-id="${escapeAttribute(student.id)}"
                >

                    <option
                        value="Present"
                        ${
                            status ===
                            "Present"
                                ? "selected"
                                : ""
                        }
                    >
                        Present
                    </option>

                    <option
                        value="Absent"
                        ${
                            status ===
                            "Absent"
                                ? "selected"
                                : ""
                        }
                    >
                        Absent
                    </option>

                </select>

            `;


            attendanceList.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   SAVE ATTENDANCE
===================================================== */

document
    .getElementById(
        "saveAttendanceBtn"
    )
    .addEventListener(
        "click",
        saveAttendance
    );


function saveAttendance() {

    if (
        !currentUser ||
        (
            currentUser.role !== "admin" &&
            currentUser.role !== "teacher"
        )
    ) {

        alert(
            "You do not have permission to record attendance."
        );

        return;

    }


    const date =
        attendanceDate.value;


    if (!date) {
        return;
    }


    const selects =
        document.querySelectorAll(
            ".attendance-select"
        );


    selects.forEach(
        select => {

            const studentId =
                select.getAttribute(
                    "data-student-id"
                );


            const status =
                select.value;


            const index =
                attendance.findIndex(
                    record =>
                        record.studentId ===
                            studentId &&
                        record.date ===
                            date
                );


            const record = {

                studentId,
                date,
                status

            };


            if (index >= 0) {

                attendance[index] =
                    record;

            } else {

                attendance.push(
                    record
                );

            }

        }
    );


    saveData();


    updateDashboard();

    renderRecords();

    updateReports();


    if (selectedProfileStudentId) {

        renderProfileAttendance();

    }


    showAttendanceMessage(
        "Attendance saved successfully.",
        "success"
    );

}


/* =====================================================
   RECORDS
===================================================== */

function getVisibleRecords() {

    const search =
        recordSearch.value
            .toLowerCase()
            .trim();


    const status =
        recordStatusFilter.value;


    const from =
        recordFromDate.value;


    const to =
        recordToDate.value;


    return attendance
        .filter(
            record => {

                const student =
                    students.find(
                        item =>
                            item.id ===
                            record.studentId
                    );


                if (!student) {
                    return false;
                }


                if (
                    currentUser &&
                    currentUser.role ===
                    "student"
                ) {

                    if (
                        record.studentId !==
                        currentUser.studentId
                    ) {

                        return false;

                    }

                }


                const matchesSearch =

                    student.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.id
                        .toLowerCase()
                        .includes(search)

                    ||

                    record.date
                        .includes(search);


                const matchesStatus =
                    status === "all" ||
                    record.status === status;


                const matchesFrom =
                    !from ||
                    record.date >= from;


                const matchesTo =
                    !to ||
                    record.date <= to;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesFrom &&
                    matchesTo
                );

            }
        )
        .sort(
            (a,b) =>
                b.date.localeCompare(
                    a.date
                )
        );

}


function renderRecords() {

    const tbody =
        document.getElementById(
            "recordsTableBody"
        );


    const records =
        getVisibleRecords();


    tbody.innerHTML = "";


    if (!records.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">
                    No attendance records found.
                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        record => {

            const student =
                students.find(
                    item =>
                        item.id ===
                        record.studentId
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(record.date)}
                </td>

                <td>
                    ${escapeHTML(student.id)}
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>

                    <span class="${
                        record.status ===
                        "Present"
                            ? "status-present"
                            : "status-absent"
                    }">

                        ${escapeHTML(record.status)}

                    </span>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =====================================================
   RECORD FILTERS
===================================================== */

[
    recordSearch,
    recordStatusFilter,
    recordFromDate,
    recordToDate
].forEach(
    element => {

        element.addEventListener(
            "input",
            renderRecords
        );

        element.addEventListener(
            "change",
            renderRecords
        );

    }
);


document
    .getElementById(
        "clearRecordFilters"
    )
    .addEventListener(
        "click",
        function() {

            recordSearch.value = "";

            recordStatusFilter.value =
                "all";

            recordFromDate.value = "";

            recordToDate.value = "";

            renderRecords();

        }
    );


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const visibleStudents =
        currentUser &&
        currentUser.role === "student"

            ? students.filter(
                student =>
                    student.id ===
                    currentUser.studentId
            )

            : students;


    document.getElementById(
        "totalStudents"
    ).textContent =
        visibleStudents.length;


    const today =
        todayString();


    const todayRecords =
        attendance.filter(
            record =>
                record.date === today
        );


    const visibleTodayRecords =
        currentUser &&
        currentUser.role === "student"

            ? todayRecords.filter(
                record =>
                    record.studentId ===
                    currentUser.studentId
            )

            : todayRecords;


    const present =
        visibleTodayRecords.filter(
            record =>
                record.status ===
                "Present"
        ).length;


    const absent =
        visibleTodayRecords.filter(
            record =>
                record.status ===
                "Absent"
        ).length;


    document.getElementById(
        "presentToday"
    ).textContent =
        present;


    document.getElementById(
        "absentToday"
    ).textContent =
        absent;


    const rate =
        visibleTodayRecords.length
            ? Math.round(
                present /
                visibleTodayRecords.length *
                100
            )
            : 0;


    document.getElementById(
        "attendanceRate"
    ).textContent =
        rate + "%";


    renderRecentAttendance();

    renderDashboardBars();

}


/* =====================================================
   RECENT ATTENDANCE
===================================================== */

function renderRecentAttendance() {

    const tbody =
        document.getElementById(
            "recentAttendance"
        );


    let records =
        [...attendance];


    if (
        currentUser &&
        currentUser.role ===
        "student"
    ) {

        records =
            records.filter(
                record =>
                    record.studentId ===
                    currentUser.studentId
            );

    }


    records =
        records
            .sort(
                (a,b) =>
                    b.date.localeCompare(
                        a.date
                    )
            )
            .slice(0, 7);


    tbody.innerHTML = "";


    if (!records.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="3">
                    No attendance recorded yet.
                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        record => {

            const student =
                students.find(
                    item =>
                        item.id ===
                        record.studentId
                );


            if (!student) {
                return;
            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${formatDate(record.date)}
                </td>

                <td>

                    <span class="${
                        record.status ===
                        "Present"
                            ? "status-present"
                            : "status-absent"
                    }">

                        ${escapeHTML(record.status)}

                    </span>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =====================================================
   DASHBOARD BAR CHART
===================================================== */

function renderDashboardBars() {

    const container =
        document.getElementById(
            "dashboardBars"
        );


    container.innerHTML = "";


    let list =
        students;


    if (
        currentUser &&
        currentUser.role === "student"
    ) {

        list =
            students.filter(
                student =>
                    student.id ===
                    currentUser.studentId
            );

    }


    list.forEach(
        student => {

            const records =
                attendance.filter(
                    record =>
                        record.studentId ===
                        student.id
                );


            const present =
                records.filter(
                    record =>
                        record.status ===
                        "Present"
                ).length;


            const rate =
                records.length
                    ? Math.round(
                        present /
                        records.length *
                        100
                    )
                    : 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "bar-item";


            item.innerHTML = `

                <div class="bar-name">
                    ${escapeHTML(student.name)}
                </div>

                <div class="bar-track">

                    <div
                        class="bar-fill"
                        style="width:${rate}%"
                    ></div>

                </div>

                <div class="bar-value">
                    ${rate}%
                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   REPORTS
===================================================== */

function updateReports() {

    let records =
        attendance;


    if (
        currentUser &&
        currentUser.role === "student"
    ) {

        records =
            attendance.filter(
                record =>
                    record.studentId ===
                    currentUser.studentId
            );

    }


    const total =
        records.length;


    const present =
        records.filter(
            record =>
                record.status ===
                "Present"
        ).length;


    const absent =
        records.filter(
            record =>
                record.status ===
                "Absent"
        ).length;


    const rate =
        total
            ? Math.round(
                present /
                total *
                100
            )
            : 0;


    document.getElementById(
        "totalRecords"
    ).textContent =
        total;


    document.getElementById(
        "totalPresent"
    ).textContent =
        present;


    document.getElementById(
        "totalAbsent"
    ).textContent =
        absent;


    document.getElementById(
        "overallRate"
    ).textContent =
        rate + "%";


    renderStudentReport();

    renderLowAttendance();

}


/* =====================================================
   STUDENT REPORT
===================================================== */

function renderStudentReport() {

    const tbody =
        document.getElementById(
            "reportTableBody"
        );


    let list =
        students;


    if (
        currentUser &&
        currentUser.role === "student"
    ) {

        list =
            students.filter(
                student =>
                    student.id ===
                    currentUser.studentId
            );

    }


    tbody.innerHTML = "";


    list.forEach(
        student => {

            const records =
                attendance.filter(
                    record =>
                        record.studentId ===
                        student.id
                );


            const present =
                records.filter(
                    record =>
                        record.status ===
                        "Present"
                ).length;


            const absent =
                records.filter(
                    record =>
                        record.status ===
                        "Absent"
                ).length;


            const total =
                records.length;


            const rate =
                total
                    ? Math.round(
                        present /
                        total *
                        100
                    )
                    : 0;


            let performance =
                "No Data";

            let performanceClass = "";


            if (total > 0) {

                if (rate >= 85) {

                    performance =
                        "Excellent";

                    performanceClass =
                        "performance-good";

                }

                else if (rate >= 75) {

                    performance =
                        "Good";

                    performanceClass =
                        "performance-warning";

                }

                else {

                    performance =
                        "Needs Attention";

                    performanceClass =
                        "performance-danger";

                }

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${present}
                </td>

                <td>
                    ${absent}
                </td>

                <td>
                    ${total}
                </td>

                <td>
                    <strong>
                        ${rate}%
                    </strong>
                </td>

                <td class="${performanceClass}">
                    ${performance}
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =====================================================
   LOW ATTENDANCE
===================================================== */

function renderLowAttendance() {

    const container =
        document.getElementById(
            "lowAttendanceList"
        );


    let list =
        students;


    if (
        currentUser &&
        currentUser.role === "student"
    ) {

        list =
            students.filter(
                student =>
                    student.id ===
                    currentUser.studentId
            );

    }


    container.innerHTML = "";


    let found = false;


    list.forEach(
        student => {

            const records =
                attendance.filter(
                    record =>
                        record.studentId ===
                        student.id
                );


            if (!records.length) {
                return;
            }


            const present =
                records.filter(
                    record =>
                        record.status ===
                        "Present"
                ).length;


            const rate =
                Math.round(
                    present /
                    records.length *
                    100
                );


            if (rate >= 75) {
                return;
            }


            found = true;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "alert-item";


            item.innerHTML = `

                <span>
                    <strong>
                        ${escapeHTML(student.name)}
                    </strong>

                    <br>

                    <small>
                        ${escapeHTML(student.id)}
                    </small>
                </span>

                <strong>
                    ${rate}%
                </strong>

            `;


            container.appendChild(
                item
            );

        }
    );


    if (!found) {

        container.innerHTML = `

            <div class="alert-item">

                <span>
                    No students currently require attention.
                </span>

                <strong>✓</strong>

            </div>

        `;

    }

}


/* =====================================================
   CSV EXPORT
===================================================== */

document
    .getElementById(
        "exportRecordsBtn"
    )
    .addEventListener(
        "click",
        exportCSV
    );


function exportCSV() {

    const records =
        getVisibleRecords();


    if (!records.length) {

        alert(
            "There are no records to export."
        );

        return;

    }


    let csv =
        "Date,Student ID,Student,Programme,Year,Status\n";


    records.forEach(
        record => {

            const student =
                students.find(
                    item =>
                        item.id ===
                        record.studentId
                );


            csv += [

                record.date,

                student.id,

                csvSafe(student.name),

                csvSafe(student.programme),

                student.year,

                record.status

            ].join(",") + "\n";

        }
    );


    downloadFile(
        csv,
        "attendance-records.csv",
        "text/csv"
    );

}


/* =====================================================
   PRINT REPORT
===================================================== */

document
    .getElementById(
        "printReportBtn"
    )
    .addEventListener(
        "click",
        function() {

            window.print();

        }
    );


/* =====================================================
   BACKUP
===================================================== */

document
    .getElementById(
        "backupBtn"
    )
    .addEventListener(
        "click",
        backupData
    );


function backupData() {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        alert(
            "Only the administrator can create backups."
        );

        return;

    }


    const backup = {

        system:
            "Student Attendance Information System",

        version:
            "5.0",

        createdAt:
            new Date().toISOString(),

        students,

        attendance

    };


    downloadFile(

        JSON.stringify(
            backup,
            null,
            4
        ),

        "attendance-system-backup.json",

        "application/json"

    );

}


/* =====================================================
   RESTORE
===================================================== */

document
    .getElementById(
        "restoreBtn"
    )
    .addEventListener(
        "click",
        restoreData
    );


function restoreData() {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        alert(
            "Only the administrator can restore data."
        );

        return;

    }


    const file =
        document
            .getElementById(
                "restoreFile"
            )
            .files[0];


    if (!file) {

        alert(
            "Please select a backup JSON file."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !Array.isArray(
                        data.students
                    ) ||
                    !Array.isArray(
                        data.attendance
                    )
                ) {

                    throw new Error(
                        "Invalid backup file."
                    );

                }


                const confirmed =
                    confirm(
                        "Restore this backup?\n\nCurrent data will be replaced."
                    );


                if (!confirmed) {
                    return;
                }


                students =
                    data.students;


                attendance =
                    data.attendance;


                saveData();


                alert(
                    "Backup restored successfully."
                );


                initializeSystem();

            }

            catch (error) {

                alert(
                    "Unable to restore the backup."
                );

            }

        };


    reader.readAsText(file);

}


/* =====================================================
   CLEAR DATA
===================================================== */

document
    .getElementById(
        "clearDataBtn"
    )
    .addEventListener(
        "click",
        clearSystemData
    );


function clearSystemData() {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        alert(
            "Only the administrator can clear system data."
        );

        return;

    }


    const first =
        confirm(
            "WARNING!\n\nThis will delete all students and attendance records.\n\nContinue?"
        );


    if (!first) {
        return;
    }


    const second =
        confirm(
            "Are you absolutely sure?\n\nThis action cannot be undone unless you have a backup."
        );


    if (!second) {
        return;
    }


    localStorage.removeItem(
        "students"
    );

    localStorage.removeItem(
        "attendance"
    );


    students = [];

    attendance = [];


    initializeSystem();


    alert(
        "System data has been cleared."
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initializeSystem() {

    document.getElementById(
        "currentDate"
    ).textContent =
        new Date().toLocaleDateString(
            "en-UG",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    if (
        currentUser &&
        currentUser.role === "student"
    ) {

        students =
            students.filter(
                student =>
                    student.id ===
                    currentUser.studentId
            );

    }


    renderStudents();

    renderRecords();

    updateDashboard();

    updateReports();

}


/* =====================================================
   MESSAGES
===================================================== */

function showStudentMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "studentMessage"
        );


    element.textContent =
        message;


    element.style.color =
        type === "success"
            ? "#15803d"
            : "#dc2626";

}


function showAttendanceMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "attendanceMessage"
        );


    element.textContent =
        message;


    element.style.color =
        type === "success"
            ? "#15803d"
            : "#dc2626";

}


/* =====================================================
   UTILITIES
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-UG",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function capitalize(text) {

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


function csvSafe(value) {

    return `"${String(value)
        .replace(
            /"/g,
            '""'
        )}"`;

}


function downloadFile(
    content,
    filename,
    type
) {

    const blob =
        new Blob(
            [content],
            {
                type
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =====================================================
   START
===================================================== */

console.log(
    "Student Attendance Information System v5.0 loaded."
);