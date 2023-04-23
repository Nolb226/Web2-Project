import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import './App.css';
import './css/reset.css';
import './css/grid.css';
import './css/base.css';
import './fonts/fontawesome-free-6.1.2-web/css/all.min.css';

import Home from './components/pages/home';
import Dashboard from './components/pages/dashboard';
import Student from './components/dashboard/student/component-student/Student';
import Teacher from './components/dashboard/teacher/Teacher';
import ViewClass from './components/dashboard/student/component-student/component-joinclasspage/ViewClass';
import JoinClass from './components/dashboard/student/component-student/component-joinclasspage/JoinClass';
import StudentPage from './components/dashboard/student/component-student/component-studentpage/StudentPage';
import Test from './components/dashboard/student/component-student/component-testpage/Test';
import Result from './components/dashboard/student/component-student/component-testpage/Result';
import Class from './components/dashboard/teacher/Class/Class';
import Classes from './components/dashboard/teacher/Class/Classes';
import Classlist from './components/dashboard/teacher/Class/ClassList';
import Repass from './components/dashboard/teacher/Class/Repass';
import Exam from './components/dashboard/teacher/exam/Exam';
import ClassList from './components/dashboard/teacher/exam/ClassList';
import ExamList from './components/dashboard/teacher/exam/ExamList';

function App() {
	const currentUser = localStorage.getItem('currentUser');
	console.log(currentUser);
	{
		/* <Route path="*" element={<Home />}></Route> */
	}

	return (
		<div id="app" className="position-relative">
			<Routes>
				{!currentUser ? (
					<Route exact path="/" element={<Home />}></Route>
				) : (
					<Route exact path="/" element={<Dashboard />}>
						(
						<Route path="student" element={<Student />}>
							<Route path="" element={<Navigate to="class" replace={true} />} />
							<Route path="class" element={<ViewClass />} />
							<Route path="class/:classId/exams" element={<StudentPage />} />
							<Route path="class/join" element={<JoinClass />} />
							<Route path="exam/:classId/:examId" element={<Test />} />
							<Route path="result/:examId" element={<Result />} />
							<Route path="*" element={<Student />} />
						</Route>
						): (
						<Route path="teacher" element={<Teacher />}>
							<Route path="" element={<Navigate to="class" replace={true} />} />
							<Route path="class" element={<Class />}>
								<Route path="" element={<Classes />} />
								<Route path=":classId" element={<Classlist />} />
								<Route path=":classId/edit" element={<Repass />} />
							</Route>
							<Route path="exam" element={<Exam />}>
								<Route path="" element={<ExamList />} />
								<Route path="create" element={<ClassList />} />
							</Route>
							{/* <Route path="class/:classId/student/:studentId/edit" element={<Student />} /> */}
						</Route>
						)
					</Route>
				)}
			</Routes>
			{/* <Home /> */}
		</div>
	);
}

export default App;
