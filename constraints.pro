constraints_min_version(1).

% This file is written in Prolog
% It contains rules that the project must respect.
% In order to see them in action, run `yarn constraints source`

% This rule will enforce that a workspace MUST depend on the same version of a dependency as the one used by the other workspaces
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType) :-
  % Iterates over all dependencies from all workspaces
    workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  % Iterates over similarly-named dependencies from all workspaces (again)
    workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType2),
  % Ignore peer dependencies
    DependencyType \= 'peerDependencies',
    DependencyType2 \= 'peerDependencies',
  % Ignore devDependencies on other workspaces
    (
      (DependencyType = 'devDependencies'; DependencyType2 = 'devDependencies') ->
        \+ workspace_ident(DependencyCwd, DependencyIdent)
      ;
        true
    ).

% This rule will prevent workspaces from depending on non-workspace versions of available workspaces
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, 'workspace:^', DependencyType) :-
  % Iterates over all dependencies from all workspaces
    workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  % Only consider those that target something that could be a workspace
    workspace_ident(DependencyCwd, DependencyIdent).

% This rule will enforce that all packages must have an correct engines.node field
% Keep in sync with the range inside packages/yarnpkg-cli/sources/main.ts
gen_enforced_field(WorkspaceCwd, 'engines.node', '18.x').

% Required to make the package work with the GitHub Package Registry
gen_enforced_field(WorkspaceCwd, 'repository.type', 'git').
gen_enforced_field(WorkspaceCwd, 'repository.url', 'ssh://git@github.com/lukeshay/astro-aws.git').
gen_enforced_field(WorkspaceCwd, 'repository.directory', WorkspaceCwd).

% Validate other fields
gen_enforced_field(WorkspaceCwd, 'homepage', 'https://astro-aws.org/').
gen_enforced_field(WorkspaceCwd, 'license', 'MIT').
gen_enforced_field(WorkspaceCwd, 'eslintConfig.extends', ['../../.eslintrc.cjs'] || ['../.eslintrc.cjs']).
