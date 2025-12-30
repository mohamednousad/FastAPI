import { User } from '../models/user.js';

export const getUsers = async (_, res) =>
  res.json(await User.getAll());

export const getUser = async (req, res) => {
  const user = await User.getById(req?.params?.id);
  user ? res.json(user) : res.status(404).json({ message: 'Not found' });
};

export const createUser = async (req, res) => {
  try {
    res.status(201).json(await User.create(req?.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.update(req?.params?.id, req?.body);
    user ? res.json(user) : res.status(404).json({ message: 'Not found' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteUser = async (req, res) => {
  const ok = await User.remove(req?.params?.id);
  ok ? res.json({ success: true }) : res.status(404).json({ message: 'Not found' });
};
