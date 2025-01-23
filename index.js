#!/usr/bin/env node

import inquirer from 'inquirer' // 用于命令行交互，提示用户输入。
import ora from 'ora' // 用于在命令行中显示进度指示器。
import chalk from 'chalk' // 用于给命令行文本添加颜色和样式。
import fs from 'fs' // Node.js 的文件系统模块，用于文件和目录操作。
import path from 'path' // Node.js 的路径模块，用于处理文件和目录路径。
import { exec } from 'child_process' // 用于执行命令行命令

// GitLab 项目仓库地址
const gitlabRepos = {
  H5: 'https://github.com/upboyu/vue3-h5-template.git',
  WebVue3: 'https://github.com/upboyu/vue3-web-template.git',
  WebVue2: 'https://github.com/upboyu/vue2-web-template.git'
}

// 提示用户选择
async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目类型',
      choices: ['H5', 'WebVue3', 'WebVue2']
    },
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称',
      default: 'my-project'
    }
  ])

  return answers
}

// 下载项目
async function downloadTemplate(repoUrl, projectName) {
  const spinner = ora(`正在初始化项目 ${path.join(process.cwd(), projectName)} ...`).start()

  exec(`git clone ${repoUrl} ${projectName}`, (error, stdout, stderr) => {
    if (error) {
      spinner.fail(chalk.red(`下载失败：${error.message}`))
      return
    }
    spinner.succeed(chalk.green('项目初始化完成！可执行以下命令：'))
    console.log(chalk.green(`\n  cd ${projectName}`))
    console.log(chalk.green('  npm install'))
    console.log(chalk.green('  npm run dev'))
  })
}

// 入口函数
async function init() {
  const { projectType, projectName } = await promptUser()
  const repoUrl = gitlabRepos[projectType]
  const targetDir = path.join(process.cwd(), projectName)

  // 检查目标目录是否已存在
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`目录 ${projectName} 已经存在，请选择其他名称`))
    return
  }

  await downloadTemplate(repoUrl, projectName) // 进行下载
}

init()
