---
title: "Git & GitHub: some notes"
blurb: "Tingly head, warm stomach"
coverImage: 47
author: "Dereck Mezquita"
date: 2019-12-27

tags: [computer-science, programming, code, web-development]
published: true
comments: true
---

Notes on using Git and GitHub, mostly in the context of GitHub for version management. Useful as a quick reference. Note that all commands are preceeded by git, which we use in Visual Studio Code's terminal directly[^1].

[^1]: [Git-Commands](https://github.com/joshnh/Git-Commands)

## Installing and configuring git

Use `git version` in the Mac terminal, it should already be installed. We're just going to configure it now.

Let's give it our name and e-mail address:

- `git config --global user.name "name"`
- `git config --global user.email "email@email.com"`.

Now let's set the default editor we're using Visual Studio Code:


- `git config --global core.editor "code -w"`

Test it by asking it to open it's own configuration file with the set editor:

- `git config --global -e`

Git may repeatedly ask for username and password, to avoid this annoyance try the following commands.

Have it store the information and it will never ask again:

- `git config --global credential.helper store`
- `git config --global credential.https://github.com.username <your_username></your_username>`

Have it cache the information for a session:

- `git config --global credential.helper cache`

Set a cache timeout:

- `git config --global credential.helper 'cache --timeout=1000'`

> [!WARNING]
> These instructions are for MacOS.

## Git states

There are three main stages or states to git, these can be thought of as physically separate areas. We move from the first to the last, where the code is introduced and added to the git repository.

<style>
    #illustration-flow {
        display: block;
        position: relative;
        margin: 0 auto;
        width: fit-content;
        padding: 20px;
    }
    .illustration-flow-text {
        display: inline;
        padding: 0px;
        text-align: center;

        /* text-shadow: 2px 2px 30px black; */

        letter-spacing: -0.05em;
        font-family: "Fjalla One", sans-serif;
        font-weight: bolder;
        font-size: 20px;
        -webkit-transform: scale(1.35, 1.3);
        transform: scale(1.35, 1.3);
    }
    .illustration-colour-one {
        color: #ef0000;
    }
    .illustration-colour-two {
        color: orange;
    }
    .illustration-colour-three {
        color: #ffd700;
    }
    .illustration-colour-four {
        color: #00c000;
    }
    .illustration-colour-five {
        color: blue;
    }
    .illustration-colour-six {
        color: indigo;
    }
    .illustration-colour-seven {
        color: violet;
    }
    .illustration-arrow {
        color: #00ff08;
        padding: 0px;
    }
</style>

<div>
    <div id="illustration-flow">
        <div class="illustration-flow-text illustration-colour-one">
            Working directory
        </div>
        <div class="illustration-flow-text illustration-arrow">
            &rarr;
        </div>
        <div class="illustration-flow-text illustration-colour-two">
            Staging area
        </div>
        <div class="illustration-flow-text illustration-arrow">
            &rarr;
        </div>
        <div class="illustration-flow-text illustration-colour-three">
            Repository (.git directory)
        </div>
        <div class="illustration-flow-text illustration-arrow">
            &rarr;
        </div>
        <div class="illustration-flow-text illustration-colour-four">
            Remote server (.git directory)
        </div>
    </div>
    <figcaption>Movement of files and directories in git.</figcaption>
</div>

The working directory contains all the files and folders for the project which may or may not be managed by git; git is aware of the files though. Then the staging area is used to prepare for the next commit, they are moved from the working directory when modified and then commited to the repository. The repository of commit history (.git directory), this contains all of the commited or saved changed to the repository, this is the history of the project.

The fourth state or remote state, this state has the exact same three states as the local one, however we'll show it as a single state; a fourth one. This is GitHub, a remote git repository.

## Basic commands

### Cloning and or creating a repo

| Command                                    | Description                                       |
|--------------------------------------------|---------------------------------------------------|
| `git init`                                 | Initialise a local Git repository.                |
| `git clone https://github.com/[username]/[repository-name].git` | Create a local copy of a remote repository.     |

### Snapshotting

| Command                                   | Description                                                             |
|-------------------------------------------|-------------------------------------------------------------------------|
| `git status`                              | Check status.                                                           |
| `git add [file-name.ext]`                 | Add a file to the staging area.                                         |
| `git add .`                               | Adds all modified files to the staging area.                            |
| `git add -A`                              | Add all new and changed files to the staging area.                      |
| `git commit -m "[commit message]"`        | Commit changes. If the message option is not used the configured default editor is used. |
| `git rm -r [file-name.ext]`               | Remove a file (or directory).                                           |

### Branching and merging

| Command                                      | Description                                                            |
|----------------------------------------------|------------------------------------------------------------------------|
| `git branch`                                 | Lists all branches in a project.                                       |
| `git branch -a`                              | Lists all branches (local and remote).                                 |
| `git branch [branch name]`                   | Create a new branch.                                                  |
| `git branch -d [branch name]`                | Delete a branch.                                                      |
| `git push origin --delete [branch name]`     | Delete a remote branch.                                               |
| `git checkout -b [branch name]`              | Create a new branch and switch to it.                                 |
| `git checkout -b [branch name] origin/[branch name]` | Clone a remote branch and switch to it.                       |
| `git branch -m [old branch name] [new branch name]` | Rename a local branch.                                      |
| `git checkout [branch name]`                 | Switch to a branch.                                                   |
| `git checkout -`                            | Switch to most recent branch checked out.                              |
| `git checkout -- [file-name.ext]`           | Discards changes to a file.                                           |
| `git merge [branch name]`                    | Merge a branch into the active branch. Note: if wanting to merge into master, be in master when executing this command. |
| `git merge [source branch] [target branch]`  | Merge a branch into a target branch.                                   |
| `git stash`                                  | Stash changes in a dirty working directory.                            |
| `git stash clear`                            | Remove all stashed entries.                                            |

### Sharing or updating projects

| Command                                           | Description                                             |
|---------------------------------------------------|---------------------------------------------------------|
| `git push origin [branch name]`                   | Push a branch to your remote repository.               |
| `git push -u origin [branch name]`                | Push changes to remote repository (and remember the branch). |
| `git push`                                       | Push changes to remote repository (remembered branch). |
| `git push origin --delete [branch name]`          | Delete a remote branch.                                |
| `git pull`                                       | Update local repository to the newest commit.          |
| `git pull origin [branch name]`                   | Pull changes from remote repository.                   |
| `git remote add origin ssh://git@github.com/[username]/[repository-name].git` | Add a remote repository. |
| `git remote set-url origin ssh://git@github.com/[username]/[repository-name].git` | Set a repository's origin branch to SSH. |

### Inspecting and comparing

| Command                                   | Description                                            |
|-------------------------------------------|--------------------------------------------------------|
| `git log`                                 | View changes.                                          |
| `git log --summary`                       | View changes (detailed).                               |
| `git log --oneline`                       | View changes (briefly).                                |
| `git diff [source branch] [target branch]` | Preview changes before merging. I prefer using VSCode extension GitLens for this. |

### Advanced commands

| Command                                                  | Description |
|----------------------------------------------------------|-------------|
| `git config --global alias.[command-name] "[command chain]"` | Try this on the subsequent for viewing history command, call it hist. Verify with `git config --global --list`. |
| `git log --oneline --graph --decorate --all`             | `--oneline` provides a simplified commit entry (gives more information on a single line), `--graph` shows us an asterisk-based graph denoting the branching hierarchy, `--decorate` shows which commits are a part of which branches, `--all` gives us all branches in the repo. |
| `git mv [file-name.ext]`                                 | Stages moving a file to a new name, this renames the file. Benefit of git tracking the move. Commit to complete. |
| `git rm [file-name.txt]`                                 | Stages removing a file or deletes it. Benefit of git tracking the deletion. Commit to complete. |
| `git add -u`                                            | Use whenever a file is modified outside of the git CLI; u is for update. This updates the file changes and stages them. Commit to complete. |

## Excluding files

Here let's imagine we have a log file that will not be included in the final project. We'll use the `.gitingore` file for this.

The syntax for this file is one pattern or expression per line. For excluding .log, we'll do `*.log`. Now we must track the `.gitignore` in the repository; `git add .gitignore`, `git commit -m "Add ignore file"`.
