import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons"; // 确保正确导入 faYoutube 图标
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Button, Card, Carousel } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../pages/moviestyle.css";
import { useMediaQuery } from "react-responsive";

const Detail = () => {
  const location = useLocation();
  const { movieDetails: movie } = location.state;
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [isHidden, setIsHidden] = React.useState(false);
  const averageScore =
    movie.reviews.reduce((acc, review) => acc + review.score, 0) /
    movie.reviews.length;
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsHidden(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!movie) return <div>Loading...</div>;
  console.log("movie:", movie);
  // console.log("still",movie.stills);
  // console.log("actor:",movie.actors);
  return (
    <Container className="bg-dark text-white mt-7 MDmoviestyle-text">
      <div
        className="position-fixed"
        style={{
          left: "90%",
          top: "30%",
          zIndex: 1000,
          display: isHidden ? "block" : "none",
          writingMode: "vertical-lr",
          maxWidth: "calc(100% - 200px)",
          overflowX: "hidden",
        }}
      >
        <Link to={`/booking/${movie.id}`}>
          <Button
            className="MDmoviestyle-text"
            style={{ padding: "8px 5px", fontWeight: "600" }}
          >
            立即訂票
          </Button>
        </Link>
      </div>
      <Row>
        <Col>
          <div className="mdmoviestyle-img-wrapper img-fluid position-relative">
            <img
              className="mdmoviestyle-img img-fluid"
              src={movie.poster}
              alt={movie.title}
            />
            <a
              className="position-absolute top-50 start-50 translate-middle"
              href={`https://www.youtube.com/watch?v=${movie.trailer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faYoutube}
                style={{ color: "#f90101", fontSize: "60px" }}
              />
            </a>
            <div
              className={"position-absolute"}
              style={{ bottom: "-55px", left: "0", padding: "3px" }}
            >
              <h1 className="me-5">{movie.title}</h1>
              <h3>{movie.title_english}</h3>
            </div>
            <div
              className={
                isLargeScreen ? "position-absolute" : "ms-dispaly-none"
              }
              style={{
                bottom: "-45px",
                right: "0",
                padding: "3px",
                display: isHidden ? "none" : "block",
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className={isLargeScreen ? "img-fluid" : "ms-dispaly-none"}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "250px",
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  backgroundColor: "#fff",
                  marginBottom: "10px",
                }}
              />
              <Link to={`/booking/${movie.id}`}>
                <Button
                  className={isLargeScreen ? " " : "ms-dispaly-none"}
                  style={{ width: "100%", fontWeight: "600" }}
                >
                  立即訂票
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="mt-2">
          <hr className="mshr-style" />
          <span className="msborder-style MDmoviestyle-text-small">
            {movie.rating}
          </span>
          <span className="msborder-style">
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "#FFD43B", fontSize: "18px" }}
            />
            <span className="MDmoviestyle-text-small">
              {averageScore.toFixed(1)}
            </span>{" "}
          </span>
          <span className="msborder-style MDmoviestyle-text-small">
            {movie.genre}
          </span>
          <span className="msborder-style MDmoviestyle-text-small">
            {movie.runtime}分鐘
          </span>
          <div className="mt-3 MDmoviestyle-text-small">{movie.synopsis}</div>
          <div className="mt-3 MDmoviestyle-text-small">
            導演: {movie.director}
          </div>
          <div className="MDmoviestyle-text-small">
            主演: {movie.actors.map((actor) => actor.name).join(" / ")}
          </div>
          <div className="MDmoviestyle-text-small">語言: {movie.language}</div>
        </Col>
      </Row>
      <Row className="mt-5 justify-content-between">
        <h4>精彩劇照</h4>
        {movie.stills.map((still, index) => (
          <img
            key={index}
            className="ms-stills col-xxl-4 col-xl-12 col-lg-12 d-flex justify-content-center mb-3"
            src={still.stills}
            alt={`still-${index}`}
          ></img>
        ))}
      </Row>
      <Row className="mt-5 justify-content-between">
        <h4>主要演員</h4>
        <Carousel indicators={false} controls={false}>
          {movie.actors
            .reduce((result, actor, index) => {
              const chunkIndex = Math.floor(index / 3);

              if (!result[chunkIndex]) {
                result[chunkIndex] = []; // 初始化新的一组
              }

              result[chunkIndex].push(
                <Col
                  key={index}
                  className="col-4 d-flex flex-column align-items-center mb-3"
                >
                  <img
                    className="ms-stills"
                    src={actor.actors}
                    alt={`actor-${index}`}
                    style={{
                      width: "550px",
                      height: "350px",
                      objectFit: "cover",
                    }} // 设置图片宽高一致，并保持比例
                  />
                  <div
                    className="mt-2 text-center"
                    style={{ fontSize: "18px" }}
                  >
                    {actor.name}
                  </div>{" "}
                  {/* 设置字体大小 */}
                </Col>
              );

              return result;
            }, [])
            .map((chunk, chunkIndex) => (
              <Carousel.Item key={chunkIndex}>
                <Row>{chunk}</Row>
              </Carousel.Item>
            ))}
        </Carousel>
      </Row>

      <Row className="d-flex justify-content-start mt-5">
        <Col>
          <span className="h4 me-3">精彩評論</span>
          <span className="MDmoviestyle-text-small">
            <Link to="/reviews" className="text-decoration-underline">
              查看更多
            </Link>
          </span>
          <hr className="mshr-style" />
          {movie.reviews.map((review, index) => (
            <Card
              key={index}
              className="mt-3 MDmoviestyle-body MDmoviestyle-text bg-dark text-white position-relative"
            >
              <Card.Body>
                <div className="d-flex align-items-start">
                  <div style={{ marginTop: "15px" }}>
                    <img
                      src={review.photo}
                      alt={review.nickName}
                      className="me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <div>
                    <div className="d-flex flex-column">
                      <Card.Title className="mb-0 small">
                        {`${review.nickName}`}
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "0.8em" }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              style={{
                                color: i < review.score ? "yellow" : "gray",
                              }}
                            />
                          ))}
                        </span>
                      </Card.Title>
                    </div>
                    <div>{review.comment}</div>
                  </div>
                </div>
              </Card.Body>
              <div
                className="position-absolute"
                style={{
                  bottom: "10px",
                  right: "10px",
                  fontSize: "0.8em",
                  color: "white",
                }}
              >
                {new Date(review.reviewDate).toLocaleDateString()}{" "}
                {new Date(review.reviewDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Detail;
