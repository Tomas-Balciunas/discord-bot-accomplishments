/* eslint-disable class-methods-use-this */
import * as schema from '@/modules/sprints/schema';
import SprintModel from '@/modules/sprints/model';
import NotFound from '@/utils/errors/NotFound';
import { Sprints } from '@/database';
import BadRequest from '@/utils/errors/BadRequest';
import { composeSprintCreateMessage, composeSprintDeleteMessage, composeSprintUpdateMessage, sprintChanges } from '@/utils';

export default class SprintService extends SprintModel {
  async fetchSprintByCode(sprintCode: string) {
    const identifier = schema.parseCode(sprintCode);
    const result = await this.selectTitle(identifier);

    if (!result) {
      throw new NotFound(`Sprint by code of ${sprintCode} not found.`);
    }

    return result;
  }

  async handleUpdateSprint(id: string, body: any) {
    if (Object.keys(body).length === 0)
      throw new BadRequest('No data to update.');

    const partial = schema.parseUpdateable(body);
    const identifier = schema.parseId(id);

    const old = await this.select(identifier);
    const result = await this.update(identifier, partial);

    return { old, result };
  }

  updateNotif(sprint: Sprints, old: Sprints) {
    sprintChanges(() => composeSprintUpdateMessage(sprint, old), old)
  }

  deleteNotif(sprint: Sprints) {
    sprintChanges(() => composeSprintDeleteMessage(sprint), sprint)
  }

  createNotif(sprint: Sprints) {
    sprintChanges(() => composeSprintCreateMessage(sprint), sprint)
  }
}
