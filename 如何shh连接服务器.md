## 先说在哪里配置 

在.ssh 下面的config配置服务器参数 注意一定要加上允许pushkey这个选项

## 扫盲

**私钥 (Private Key)**：`id_ed25519`，留在本地 Mac，绝对保密（你的专属钥匙）。

**公钥 (Public Key)**：`id_ed25519.pub`，推送到服务器（门上的特制锁芯）。 只有你的私钥能解开服务器上对应公钥的挑战，从而实现无密码验证。

## 生成钥匙

检查

```cmd
ls -al ~/.ssh/
```

*如果没有 `id_ed25519`，执行生成命令（一路回车即可）：*

```cmd
ssh-keygen -t ed25519 -C "macbook-air"
```

## 推送锁芯到服务器

```cmd
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 30098 root@36.138.103.18
```

## 开启服务端的ssh机制

**目标**：CentOS 9 默认关闭了密钥登录，且 SELinux 权限控制极严，必须手动放行。

1. **用密码最后登录一次服务器**

   Bash

   ```
   ssh root@36.138.103.18 -p 30098
   ```

2. **开启“允许密钥登录”开关**

   Bash

   ```
   vi /etc/ssh/sshd_config
   ```

   - 在文件中找到 `PubkeyAuthentication`，确保其值为 `yes` 且没有被 `#` 注释掉。

   - 保存并重启 SSH 服务：

     Bash

     ```
     systemctl restart sshd
     ```

```
3. **修复目录权限与 SELinux 安全上下文（防坑必做）**
   依次执行以下命令，确保 SSH 守护进程“敢于”读取密钥文件：
   ```bash
   chmod 750 /root
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   restorecon -Rv ~/.ssh  # 重新打上 CentOS 专属的安全标签
```

