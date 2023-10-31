import { Command } from 'commander'

import { createTemplateCommand } from './create-template.js'

const program = new Command()

program
    .name('kismet-cli')
    .version('0.1.0')
    .description('CLI tool for developing kismet.ts');

createTemplateCommand(program)

program.parse()
