export default {
  get: jest.fn().mockResolvedValue({
    status: 200,
    data: [
      {
        commentCount: 0,
        comments: [],
        _id: '5d807d9j37900a0kd4bab0e9',
        title: 'Great Expectations',
      },
      {
        commentCount: 1,
        comments: ['Life Changing'],
        _id: '4i807d9jbl200a0kd40pl0e9',
        title: 'War and Peace',
      },
    ],
  }),
  post: jest.fn().mockResolvedValue({
    status: 200,
  }),
  delete: jest.fn().mockResolvedValue({
    status: 200,
  }),
};
