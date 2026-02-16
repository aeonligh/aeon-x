const { execSync } = require('child_process');
try {
  const result = execSync('git push -u github main --force', { encoding: 'utf8' });
  console.log(result);
} catch (error) {
  console.error(error.message);
  console.error(error.stdout);
  console.error(error.stderr);
}
