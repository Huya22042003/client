import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/images/logo/footer.png'
import './index.css';
import { Col, Row } from 'antd';
const FooterUser = () => {
    return (
        <div className="container-fluid position-relative" id="footer">
            <div className="px-32">
                <footer>
                <Row>
                    <Col span={6} className="col-12 col-md-3 col-sm-12">
                        <NavLink href="/home">
                            <span>
                                <img src={logo} alt="homepage" />
                            </span>
                        </NavLink>
                    </Col>
                    <Col span={18} className="col-12 col-md-9 col-sm-12">
                    <h1 className='text-white' style={{fontSize: '1.5em'}}>THÔNG TIN LIÊN HỆ</h1>
                    <p>
                        Trụ sở chính Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm,
                        Hà Nội
                    </p>
                    <Row className="row">
                        <Col span={12} className="col-6">
                        <div>
                            <h6>Cơ sở Hà Nội</h6>
                            <p>
                            Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
                            </p>
                            <p>(024) 7300 1955</p>
                        </div>
                        <div>
                            <h6>Cơ sở Đà Nẵng</h6>
                            <p>
                            Số 137 Nguyễn Thị Thập, Phường Hòa Minh, Quận Liên Chiểu, TP.
                            Đà Nẵng
                            </p>
                            <p>(0236) 3710 999</p>
                        </div>
                        <div>
                            <h6>Cơ sở Cần Thơ</h6>
                            <p>
                            Số 288, Nguyễn Văn Linh, phường An Khánh, quận Ninh Kiều, Tp.
                            Cần Thơ.
                            </p>
                            <p>(0292) 7300 468</p>
                        </div>
                        <div>
                            <h6>Cơ sở Hải Phòng</h6>
                            <p>
                            271 Lê Thánh Tông, phường Máy Chai, quận Ngô Quyền, TP Hải
                            Phòng.
                            </p>
                            <p>(0915) 431 313</p>
                        </div>
                        </Col>
                        <Col span={12} className="col-6">
                        <div>
                            <h6>Cơ sở Hồ Chí Minh</h6>
                            <p>391A Nam Kỳ Khởi Nghĩa, Q. 3, TP. Hồ Chí Minh</p>
                            <p>778/B1 Nguyễn Kiệm, P.4, Q. Phú Nhuận, TP. Hồ Chí Minh</p>
                            <p>
                            Toà nhà Innovation, lô 24, Công viên phần mềm Quang Trung,
                            Quận 12, Hồ Chí Minh
                            </p>
                            <p>(028) 3526 8799 – (028) 62523434</p>
                        </div>
                        <div>
                            <h6>Cơ sở Tây Nguyên</h6>
                            <p>
                            Số 300/6 đường Hà Huy Tập, p. Tân An, TP. Buôn Ma Thuột, Đắk
                            Lắk
                            </p>
                            <p>(0262) 355 5678</p>
                        </div>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                </footer>
            </div>
            </div>

    );
};

export default FooterUser;