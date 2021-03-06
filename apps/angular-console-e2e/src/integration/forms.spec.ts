import {
  autocompletion,
  checkButtonIsDisabled,
  checkDisplayedCommand,
  checkFieldHasClass,
  clickOnTask,
  openWorkspace,
  projectPath,
  texts,
  uniqName,
  whitelistGraphql,
  elementContainsText
} from '../support/utils';

describe('Forms', () => {
  beforeEach(() => {
    whitelistGraphql();
    openWorkspace(projectPath('proj'), 'generate');
    clickOnTask('@schematics/angular', 'component');
    elementContainsText('div.context-title', '@schematics/angular - component');
  });

  it('supports basic validations', () => {
    cy.get('input[name="name"]').type('a');
    cy.get('input[name="name"]').clear();
    cy.get('input[name="project"').type('proj');

    checkFieldHasClass('name', true, 'error');
    checkButtonIsDisabled('Generate', true);

    cy.get('input[name="name"]').type(uniqName('someservice'));
    checkFieldHasClass('name', false, 'error');
    checkButtonIsDisabled('Generate', false);
  });

  it('supports project autocompletion', () => {
    cy.get('input[name="project"]').type('e2e');

    autocompletion($p => {
      expect(texts($p)[0]).to.contain('proj-e2e');
    });

    cy.get('input[name="project"]').clear();
    cy.get('input[name="project"]').type('proj');

    autocompletion($p => {
      expect(texts($p)[0]).to.contain('proj');
      expect(texts($p)[1]).to.contain('proj-e2e');
    });
  });

  it('supports module autocompletion', () => {
    cy.get('input[name="module"]').type('nothing');

    autocompletion($p => {
      expect($p.length).to.equal(0);
    });

    cy.get('input[name="module"]').clear();
    cy.get('input[name="module"]').type('app');

    autocompletion($p => {
      expect($p.length).to.equal(1);
      expect(texts($p)[0]).to.include('app.module.ts');
    });
  });

  it('updates the command in the terminal', () => {
    checkDisplayedCommand(
      'ng generate @schematics/angular:component --dry-run'
    );

    cy.get('input[name="name"]').type('cmp');
    checkDisplayedCommand(
      'ng generate @schematics/angular:component cmp --dry-run'
    );

    cy.get('mat-select[name="export"]').click();
    elementContainsText('.mat-select-panel .mat-option', 'true').click({
      force: true
    });
    checkDisplayedCommand(
      'ng generate @schematics/angular:component cmp --export --dry-run'
    );

    cy.get('mat-select[name="export"]').click();
    elementContainsText('.mat-select-panel .mat-option', 'false').click({
      force: true
    });
    checkDisplayedCommand(
      'ng generate @schematics/angular:component cmp --dry-run'
    );
  });
});
