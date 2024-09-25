/* eslint-disable no-console */
import { parseInsertable } from '@/modules/sprints/schema';
import SprintModel from '@/modules/sprints/model';
import { Database } from '..';

const projects = [
  {
    title: 'WD-1.1',
    fullTitle: 'First Steps Into Programming with Python: Project',
  },
  {
    title: 'WD-1.2',
    fullTitle: 'Intermediate Programming with Python: Project',
  },
  { title: 'WD-1.3', fullTitle: 'Object Oriented Programming: Project' },
  { title: 'WD-1.4', fullTitle: 'Computer Science Fundamentals: Project' },
  { title: 'WD-2.1', fullTitle: 'HTML and CSS - the Foundation of Web Pages' },
  { title: 'WD-2.2', fullTitle: 'Improving Websites with Javascript' },
  { title: 'WD-2.3', fullTitle: 'Learning Your First Framework - Vue.js' },
  { title: 'WD-2.4', fullTitle: 'Typing and Testing JavaScript' },
  { title: 'WD-3.1', fullTitle: 'Node.js and Relational Databases' },
  { title: 'WD-3.2', fullTitle: 'REST APIs & Test Driven Development' },
  { title: 'WD-3.3', fullTitle: 'Full-stack Fundamentals' },
  { title: 'WD-3.4', fullTitle: 'Containers and CI/CD' },
];

export async function seedSprints(db: Database): Promise<void> {
  const sprint = new SprintModel(db);
  console.log('Seeding sprints...');
  await Promise.all(
    projects.map(async (item) => {
      const s = parseInsertable(item);
      Promise.resolve(sprint.create(s));
    })
  );
  console.log('Seeding sprints complete.');
}
