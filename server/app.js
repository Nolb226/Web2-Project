'use strict';
const port = process.env.PORT || 8080;

//Packages
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

//Utils
const sequelize = require('./util/database');
const app = express();
const http = require('http').createServer(app);

require('dotenv').config();

//Models

(() => {
	const Department = require('./models/department');
	const Major = require('./models/major');
	const Lecture = require('./models/lecture');
	const Class = require('./models/class');
	const Chapter = require('./models/chapter');
	const Question = require('./models/question');
	const Exam = require('./models/exam');

	const classDetails = require('./models/classdetail');

	const Student = require('./models/student');
	const Account = require('./models/account');

	const Teacher = require('./models/teacher');
	const Notification = require('./models/notification');

	const Student_Result = require('./models/student_result');

	const Permission_Group = require('./models/permission_group');
	const Function = require('./models/function');

	//Models relationship

	Department.hasMany(Major);
	Major.belongsTo(Department);

	Major.belongsToMany(Lecture, { through: 'lecturedetail' });
	Lecture.belongsToMany(Major, { through: 'lecturedetail' });

	Lecture.hasMany(Chapter);
	Chapter.belongsTo(Lecture);

	// Chapter.belongsToMany(Exam, { through: Exam_Result });
	// Exam.belongsToMany(Chapter, { through: Exam_Result });

	Chapter.hasMany(Question);
	Question.belongsTo(Chapter);

	Student.belongsTo(Account, { foreignKey: 'accountId' });
	Account.hasOne(Student, { foreignKey: 'accountId' });

	Teacher.belongsTo(Account, { foreignKey: 'accountId' });
	Account.hasOne(Teacher, { foreignKey: 'accountId' });

	Student.belongsTo(Major);
	Major.hasMany(Student);

	// Major.belongsTo(Teacher, { foreignKey: 'headOfMajor' });
	// Teacher.hasOne(Major, { foreignKey: 'headOfMajor' });

	Student.belongsToMany(Class, {
		through: classDetails,
		foreignKey: 'studentId',
	});

	Student.hasMany(classDetails);
	classDetails.belongsTo(Student);

	Class.hasMany(classDetails);
	classDetails.belongsTo(Class);

	Class.belongsToMany(Student, {
		through: classDetails,
		foreignKey: 'classId',
	});

	Student.belongsToMany(Exam, {
		through: Student_Result,
		timestamps: false,
		foreignKey: 'studentId',
	});
	Exam.belongsToMany(Student, {
		through: Student_Result,
		timestamps: false,
		foreignKey: 'examId',
	});

	Exam.belongsToMany(Chapter, {
		through: 'examchapter',
		timestamps: false,
	});
	Chapter.belongsToMany(Exam, {
		through: 'examchapter',
		timestamps: false,
	});

	Exam.hasMany(Student_Result);
	Student_Result.belongsTo(Exam);

	Student.hasMany(Student_Result);
	Student_Result.belongsTo(Exam);

	Teacher.belongsTo(Department);
	Department.hasMany(Teacher);

	// Department.belongsTo(Teacher, { foreignKey: 'headOfDepartment' });
	// Teacher.hasOne(Department, { foreignKey: 'headOfDepartment' });

	// Teacher.hasOne(Lecture, { foreignKey: 'headOfLecture' });
	// Lecture.belongsTo(Teacher, { foreignKey: 'headOfLecture' });

	Teacher.belongsToMany(Lecture, { through: 'teach', timestamps: false });
	Lecture.belongsToMany(Teacher, { through: 'teach', timestamps: false });

	Teacher.hasMany(Class);
	Class.belongsTo(Teacher);

	Lecture.hasMany(Class);
	Class.belongsTo(Lecture);

	Class.hasMany(Exam);
	Exam.belongsTo(Class);

	Class.hasMany(Notification);
	Notification.belongsTo(Class);

	Account.belongsTo(Permission_Group, {
		timestamps: false,
		// as: 'permissions',
		foreignKey: 'type',
	});
	Permission_Group.hasMany(Account, {
		timestamps: false,
		foreignKey: 'type',
	});

	Permission_Group.belongsToMany(Function, {
		through: 'functiondetail',
		timestamps: false,
	});
	Function.belongsToMany(Permission_Group, {
		through: 'functiondetail',
		timestamps: false,
	});
})();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'excels/');
	},
	filename: (req, file, cb) => {
		let extension = file.originalname.split('.').pop();
		cb(null, `${uuidv4()}.${extension}`);
	},
});

const fileFilter = (req, file, cb) => {
	const filetypes = /xlsx|xls/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	if (extname) {
		return cb(null, true);
	} else {
		cb('Error: The file must be an XLS or XLSX file!');
	}
};

//Routes define
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const questionsRoutes = require('./routes/question');
const classesRoutes = require('./routes/class');
const chaptersRoutes = require('./routes/chapter');
const testRoutes = require('./routes/test');
const accountRoutes = require('./routes/account');
const departmentRoutes = require('./routes/department');
const majorRoutes = require('./routes/major');
const lectureRoutes = require('./routes/lecture');
const adminRoutes = require('./routes/admin');
const permissionsRoutes = require('./routes/permission');
const { checkPermission } = require('./middleware/check-permission');
const { errorResponse, throwError } = require('./util/helper');
//Middleware

app.use(bodyParser.json());
app.use(multer({ storage, fileFilter }).single('classExcel'));
// app.use(express.static(path.join(__dirname, 'excels')));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS,GET,POST,PUT,DELETE,PATCH'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
});
//Routes seperate paths

app.use(cors());
app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/departments', departmentRoutes);
app.use('/majors', majorRoutes);
app.use('/lectures', lectureRoutes);
app.use('/questions', questionsRoutes);
app.use('/classes', classesRoutes);
app.use('/chapters', chaptersRoutes);
app.use('/admin', adminRoutes);
app.use('/test', testRoutes);
app.use('/permissions', permissionsRoutes);
//App start when connected to database
app.get('/', (req, res) => {
	res.send(Hiii);
});

app.use(function (err, req, res, next) {
	// Handle the error
	console.error(err);

	// Send an error response to the client
	errorResponse(res, err);
});

sequelize
	// .sync({ force: true })
	.sync()

	.then(() => {
		const io = require('./util/socket').init(http);

		http.listen(port, '0.0.0.0', function () {
			console.log(
				'Express server listening on port %d in %s mode',
				this.address().port,
				app.settings.env
			);
		});
	})
	.catch((err) => console.log('Fail to connect to the database ' + err));
