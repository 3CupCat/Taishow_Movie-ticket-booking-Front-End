import React, { useEffect, useState } from 'react';
import {
  Box, Table, Tbody, Tr, Th, Td, Thead, VStack, Text, HStack, Button, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Link, ModalCloseButton, Image, Flex, useBreakpointValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get('token');
      if (!token) {
        alert('未找到token，請重新登錄');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/order/orderDetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
        alert('無法獲取訂單歷史記錄，請稍後再試');
      }
    };

    fetchOrders();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedOrder(null);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });

  const formatDate = (dateString) => {
    return dateString.replace(/-/g, '/');
  };

  return (
    <Box width="100%" p={4} boxShadow="md" bg="white" borderRadius="md" color="black">
      <VStack spacing={4} align="center">
        <Text fontSize="2xl" fontWeight="bold">歷史訂單</Text>
        <Box maxHeight="100vh" overflowY="auto" width="100%">
          <Table variant="striped" colorScheme="white" size="sm">
            <Thead>
              <Tr>
                <Th color="white">訂單號</Th>
                <Th color="white">日期</Th>
                <Th color="white">總金額</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.length === 0 ? (
                <Tr>
                  <Td colSpan="3">
                    <Flex justify="center" align="center">
                      <Text color="black" fontSize="24px" fontWeight="bold" mt={3}>
                        目前沒有訂單! 快去下訂吧! <Link href="/" color="teal.500">點擊這裡</Link>
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
              ) : (
                currentOrders.map((order) => (
                  <Tr key={order.order.orderNum} onClick={() => handleShowModal(order)} _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}>
                    <Td>{order.order.orderNum}</Td>
                    <Td>{formatDate(order.order.orderDate.split(' ')[0])}</Td>
                    <Td>{order.order.totalAmount}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
        <HStack spacing={2}>
          <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} leftIcon={<ArrowLeftIcon />}>First</Button>
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} leftIcon={<ChevronLeftIcon />}>Prev</Button>
          {[...Array(totalPages).keys()].map(number => (
            <Button key={number + 1} onClick={() => handlePageChange(number + 1)} isActive={number + 1 === currentPage}>
              {number + 1}
            </Button>
          ))}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} rightIcon={<ChevronRightIcon />}>Next</Button>
          <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} rightIcon={<ArrowRightIcon />}>Last</Button>
        </HStack>

        {selectedOrder && (
          <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size={modalSize}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>訂單詳細資料</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text color="black"><strong>訂單號:</strong> {selectedOrder.order.orderNum}</Text>
                {selectedOrder.movie && (
                  <>
                    <Text color="black"><strong>電影標題:</strong> {selectedOrder.movie.title}</Text>
                  </>
                )}
                {selectedOrder.showtime && (
                  <>
                    <Text color="black"><strong>放映時間:</strong> {formatDate(selectedOrder.showtime.showTime.replace('T', ' '))}</Text>
                  </>
                )}
                {selectedOrder.theater && (
                  <>
                    <Text color="black"><strong>電影院名稱:</strong> {selectedOrder.theater.theaterName}</Text>
                  </>
                )}
                {selectedOrder.screen && (
                  <>
                    <Text color="black"><strong>影廳名稱:</strong> {selectedOrder.screen.screenName}</Text>
                  </>
                )}
                {selectedOrder.ticket && (
                  <>
                    <Text color="black"><strong>座位:</strong> {selectedOrder.ticket.seatNum}</Text>
                  </>
                )}
                <Text color="black"><strong>下訂日期:</strong> {selectedOrder.order.orderDate ? formatDate(selectedOrder.order.orderDate.split(' ')[0]) : '無資料'}</Text>
                {selectedOrder.payment && (
                  <>
                    <Text color="black"><strong>付款日期:</strong> {selectedOrder.payment.payTime ? formatDate(selectedOrder.payment.payTime.split(' ')[0]) : '無資料'}</Text>
                    {/* <Text color="black"><strong>付款方式:</strong> {selectedOrder.payment.payway}</Text> */}
                    <Text color="black"><strong>付款狀態:</strong> {selectedOrder.payment.payStatus}</Text>
                  </>
                )}
                <Text color="black"><strong>總金額:</strong> {selectedOrder.order.totalAmount}</Text>
                <Box p={4}>
                  <Flex direction="column" align="center" justify="center">
                    <Image
                      src={selectedOrder.order.qrcode}
                      alt="QR Code"
                      border="2px solid"
                      borderColor="black"
                      boxSize="100px"
                    />
                    <Text color="black" fontWeight="bold" mt={2}>
                      qrcode
                    </Text>
                  </Flex>
                </Box>
              </ModalBody>
              <ModalFooter>
                {/* <Button variant="ghost" onClick={handleCloseModal}>關閉</Button> */}
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Box>
  );
};

export default OrderHistory;
