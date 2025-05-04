#!/usr/bin/env node

/**
 * Netlify Deployment Script for Amazon Room Scanner
 * 
 * This script helps automate the deployment process to Netlify.
 * It requires the Netlify CLI to be installed globally.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 Amazon Room Scanner - Netlify Deployment Helper\n');

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI detected');
} catch (error) {
  console.log('❌ Netlify CLI not found. Installing...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI. Please install it manually with: npm install -g netlify-cli');
    process.exit(1);
  }
}

// Build the project
console.log('\n📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed. Please fix the errors and try again.');
  process.exit(1);
}

// Deploy to Netlify
console.log('\n🌐 Preparing to deploy to Netlify...');

rl.question('Do you want to deploy to Netlify now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\n🔄 Deploying to Netlify...');
    try {
      // Check if user is logged in to Netlify
      try {
        execSync('netlify status', { stdio: 'ignore' });
      } catch (loginError) {
        console.log('\n🔑 Please log in to your Netlify account:');
        execSync('netlify login', { stdio: 'inherit' });
      }
      
      // Initialize site if needed
      console.log('\n🏗️ Setting up Netlify site...');
      try {
        execSync('netlify sites:list', { stdio: 'ignore' });
        rl.question('\nDo you want to create a new site or use an existing one? (new/existing): ', (siteChoice) => {
          if (siteChoice.toLowerCase() === 'new') {
            execSync('netlify sites:create --name amazon-room-scanner', { stdio: 'inherit' });
          } else {
            execSync('netlify link', { stdio: 'inherit' });
          }
          
          // Deploy the site
          console.log('\n🚀 Deploying to Netlify...');
          execSync('netlify deploy --prod', { stdio: 'inherit' });
          console.log('\n✅ Deployment complete! Your site is now live on Netlify.');
          rl.close();
        });
      } catch (error) {
        execSync('netlify init', { stdio: 'inherit' });
        console.log('\n🚀 Deploying to Netlify...');
        execSync('netlify deploy --prod', { stdio: 'inherit' });
        console.log('\n✅ Deployment complete! Your site is now live on Netlify.');
        rl.close();
      }
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      rl.close();
      process.exit(1);
    }
  } else {
    console.log('\n📝 Deployment cancelled. You can deploy manually using the Netlify CLI or web interface.');
    console.log('To deploy manually, run: netlify deploy --prod');
    rl.close();
  }
});