/* eslint-disable no-console */
import TemplateModel from "@/modules/templates/model";
import { parseInsertable } from "@/modules/templates/schema";
import { Database } from "..";

const templates = [
    { message: "A round of applause for your achievement!" },
    { message: "Congratulations on a job well done!" },
    { message: "You did it! So proud of you!" },
    { message: "Way to go! You smashed it!" },
    { message: "Cheers to your success!" },
    { message: "Bravo! You're unstoppable!" },
    { message: "Well done! You deserve all the praise." },
    { message: "Hats off to your accomplishment!" },
    { message: "Fantastic work! Keep shining!" },
    { message: "You've truly outdone yourself. Celebrate this victory!" }
  ];

  export async function seedTemplates(db: Database): Promise<void> {
    const template = new TemplateModel(db)
    console.log('Seeding templates...');
    await Promise.all(
      templates.map(async (item) => {
        const t = parseInsertable(item);
        Promise.resolve(template.create(t));
      })
    );
    console.log('Seeding templates complete.');
  }