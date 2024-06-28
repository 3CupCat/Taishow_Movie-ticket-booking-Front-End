import React from "react";
import Sidebar from "../Sidebar";
import BonusPoints from "../BonusPoints";
import { Flex, Box, Center, useBreakpointValue } from "@chakra-ui/react";

const BonusPointsList = () => {
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });
  const sidebarWidth = useBreakpointValue({ base: "100%", md: "auto" });
  const contentWidth = useBreakpointValue({
    base: "100%",
    md: "calc(100% - 250px)",
  });
  const height = useBreakpointValue({ base: "660px", md: "auto" });

  return (
    <Center bg="#f0f2f5" mt="50px" h={height}>
      <Flex
        direction={flexDirection}
        maxW="800px"
        w="full"
        bg="white"
        boxShadow="lg"
        overflow="hidden"
        h="full"
        mt="4"
      >
        <Box w={sidebarWidth} p="4">
          <Sidebar />
        </Box>
        <Box flex="1" w={contentWidth} p="4">
          <BonusPoints />
        </Box>
      </Flex>
    </Center>
  );
};

export default BonusPointsList;
