import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = {
  getTasks: jest.fn(),
  findOne: jest.fn(),
};

const mockUser = {
  id: 'userId',
  username: 'testUser',
  password: 'testPassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: any; // Change type to any to avoid TypeScript errors

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: () => mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const mockFilterDto: GetTasksFilterDto = {
        status: TaskStatus.OPEN,
        search: '',
      };

      mockTasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(mockFilterDto, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the task', async () => {
      const mockTask = {
        id: 'taskId',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
      };
      mockTasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('taskId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('throws an error if task not found', async () => {
      mockTasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('taskId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
