import path from 'path';
import { execFile } from 'child_process';

interface LoginData {
  username: string;
  password: string;
}

export async function handleInputFormSubmission(data: LoginData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'src/python/test.py');
    const payload = JSON.stringify(data);

    console.log("[Node] Payload being sent to Python:", payload);
    console.log("[Node] Running script at:", scriptPath);

    execFile('python3', [scriptPath, payload], (error, stdout, stderr) => {
      console.log("[Node] STDOUT:", stdout);
      console.log("[Node] STDERR:", stderr);

      if (error) {
        console.error("Python script error:", stderr);
        reject(new Error("Failed to execute backend logic"));
        return;
      }

      try {
        const result = JSON.parse(stdout); 
        resolve(result); 
      } catch {
        console.error("Error parsing script output:", stdout);
        reject(new Error("Failed to parse script output"));
      }
    });
  });
}
