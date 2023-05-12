import ClassItem from './ClassItem';
import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
// import Paginator from "./Paginator";
import api from '../../../../config/config';
import { Outlet, useOutlet, useSearchParams } from 'react-router-dom';
import './style.css';
import LoadingData from '../../../loadingAnimation/LoadingData';
import Paginator from '../Class/Paginator';

function StatisticClasses(prop) {
	const [classes, setClasses] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [search, setSearch] = useState('');
	const [searchParams, setSearchParams] = useSearchParams({ search: '' });
	const outlet = useOutlet();

	const [isLoadingData, setIsLoadingData] = useState(false);
	const [errorLoadingData, setErrorLoadingData] = useState('');

	const handleClasses = (value) => {
		const currentUser = localStorage.getItem(`currentUser`);
		setIsLoadingData(true);

		fetch(
			`${api}/classes?search=${searchParams.get('search') || ''}&page=${page}`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + currentUser,
				},
			}
		)
			.then((res) => res.json())
			.then((classes) => {
				console.log(classes);
				setClasses(classes.data.data);
				setTotalPage(Math.ceil(classes.data.total / 10));
				setIsLoadingData(false);
			})
			.catch(() => {
				setErrorLoadingData('Không thể lấy dữ liệu. Vui lòng thử lại !');
				setIsLoadingData(false);
			});
	};

	useEffect(() => {
		// const search_input = document.querySelector(".search-input");
		// handleClasses(search_input.value);
		handleClasses(searchParams.get('search'));
	}, [page, searchParams]);

	const handlePageChange = (newPage) => {
		setPage(newPage);
		console.log(newPage);
	};

	function update(Class) {
		const list = classes.map((classroom) => {
			if (Class.id === classroom.id) {
				return { ...classroom, isLock: !classroom.isLock };
			}
			return classroom;
		});
		// console.log(Class);
		setClasses(list);
		// console.log(list);
	}

	const handleLock = (Class) => {
		const currentUser = localStorage.getItem(`currentUser`);
		// console.log(Class.isLock);
		// console.log(Class.id);
		fetch(`${api}/classes/${Class.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				isLock: !Class.isLock,
			}),
			headers: {
				Authorization: 'Bearer ' + currentUser,
				'Content-type': 'application/json',
			},
		}).then((response) => response.json());
		//   .then((json) => console.log(json.data));

		update(Class);
	};

	return (
		<>
			{outlet || (
				<>
					<div class="table-zone grid position-relative">
						<div class="grid table__content ">
							<header className="table__header">
								<ul
									class="flex-center table__content--heading"
									style={{
										display: 'grid',
										gridTemplateColumns: '17% 28% 33% 10% 12%',
									}}
								>
									<li class="flex-center column-text">
										<h3>Mã Lớp</h3>
									</li>

									<li class="flex-center column-text">
										<h3>Tên Lớp</h3>
									</li>

									<li class="flex-center column-text">
										<h3>Tên môn học</h3>
									</li>

									<li class="flex-center column-text">
										<h3>SL</h3>
									</li>

									<li class="flex-center column-text">
										<h3>Thống kê</h3>
									</li>
								</ul>
							</header>

							<div class="table__content--list classes ">
								{errorLoadingData && (
									<div
										className="flex-center"
										style={{
											width: '100%',
											height: '100%',
											fontSize: '1.6rem',
											color: '#777',
										}}
									>
										{errorLoadingData}
									</div>
								)}
								{isLoadingData && <LoadingData />}
								{classes.map((Class) => {
									return (
										<ClassItem
											key={Class.id}
											Class={Class}
											handleLock={handleLock}
											handleRePass={prop.handleRePass}
											handleClassList={prop.handleClassList}
										/>
									);
								})}
							</div>
						</div>
						<div className="mobile-table-content">
							{classes.length === 0 ? (
								<div className="flex-center" style={{ height: '100%' }}>
									<h1 class="noClass">Không có lớp</h1>
								</div>
							) : (
								classes.map((Class) => {
									return (
										<div className="flex-center mobile-table-item">
											<h3>
												{Class.name} - {Class.id}
											</h3>
											<span>Môn:&nbsp; {Class.lecture_name}</span>
											<span>Lớp:&nbsp;{Class.name}</span>
											<span>Số lượng:&nbsp;{Class.totalStudent}</span>

											<button
												className="view-btn"
												style={{ backgroundColor: '#b30b00' }}
											>
												<Link
													to={`./${Class.id}/detail-statistic`}
													relative="path"
													style={{ color: '#fff' }}
												>
													Thống kê
												</Link>
											</button>
										</div>
									);
								})
							)}
						</div>

						<Paginator
							handlePageChange={handlePageChange}
							page={page}
							totalPage={totalPage}
						/>
					</div>
				</>
			)}
		</>
	);
}

export default StatisticClasses;

// StatisticClasses.map(Class => (<ClassItem key={Class.id} Class = {Class} />)) }
