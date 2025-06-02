const studentUtil = () => {
  const generateStudentId = (): string => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); // last two digits of year
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = Math.floor(now.getTime() / 1000)
      .toString()
      .slice(-5); // last 5 digits of timestamp
    return `${year}${month}${day}${timestamp}`;
  };

  return {
    generateStudentId,
  };
};

export default studentUtil;
