import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTestSuites = async (req, res) => {
  try {
    const response = await prisma.test_suites.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTestSuitesById = async (req, res) => {
  try {
    const response = await prisma.test_suites.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createTestSuites = async (req, res) => {
  const { suite_name, suite_code, description } = req.body;
  try {
    const test_suites = await prisma.test_suites.create({
      data: {
        suite_name: suite_name,
        suite_code: suite_code,
        description: description,
      },
    });
    res.status(201).json(test_suites);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTestSuites = async (req, res) => {
  const { suite_name, suite_code, description } = req.body;
  try {
    const test_suites = await prisma.test_suites.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        suite_name: suite_name,
        suite_code: suite_code,
        description: description,
      },
    });
    res.status(200).json(test_suites);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTestSuites = async (req, res) => {
  try {
    const test_suites = await prisma.test_suites.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(test_suites);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
