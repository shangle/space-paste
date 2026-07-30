import { execSync } from 'child_process';

const description = "Space Paste - Physical Location Memory & Local Stash Vault. Bridge your digital brain to real-world physical spots via web routes, QR stickers, or AI photo signatures.";
const homepage = "https://spacepaste.app/";

const body = JSON.stringify({
  description,
  homepage,
  has_issues: true,
  has_projects: true,
  has_wiki: true,
});

try {
  const result = execSync(`gh api -X PATCH repos/shangle/space-paste --input -`, {
    input: body,
    encoding: 'utf-8',
  });
  console.log("Updated GitHub About section successfully!");
} catch (err) {
  console.error("Error updating repo About:", err.message);
}
