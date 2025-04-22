const canvas = document.getElementById('invitationCanvas');
const ctx = canvas.getContext('2d');
const bgImage = new Image();
bgImage.src = 'images/bg.jpg';

bgImage.onload = () => {
  // Set canvas to actual background size
  canvas.width = bgImage.width;
  canvas.height = bgImage.height;

  drawCanvasContent(); // Initial draw after image loads
};

function addSponsor(value = '') {
  const container = document.getElementById('sponsorsSection');

  const sponsorDiv = document.createElement('div');
  sponsorDiv.style.display = 'flex';
  sponsorDiv.style.alignItems = 'center';

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('sponsorInput');
  input.value = value;
  input.placeholder = 'નિમંત્રક નું નામ અને મોબાઇલ નંબર';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.style.background = 'transparent';
  deleteBtn.style.border = 'none';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.title = 'Delete sponsor';
  deleteBtn.onclick = () => sponsorDiv.remove();

  sponsorDiv.appendChild(input);
  sponsorDiv.appendChild(deleteBtn);
  container.appendChild(sponsorDiv);
}

function validateLength(value, maxLength, fieldName) {
  if (value.length > maxLength) {
    alert(`${fieldName} ${maxLength} અક્ષરો કરતાં વધુ ન હોવું જોઈએ.`);
    return false;
  }
  return true;
}

function drawCanvasContent(callback) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0);

  const name = document.getElementById('nameInput').value.trim();
  const address = document.getElementById('addressInput').value.trim();
  const sponsors = document.querySelectorAll('.sponsorInput');
  
  if(!validateLength(name, 48, 'નામ')) return;
  if(!validateLength(address, 72, 'સરનામું')) return;
  sponsors.forEach((sponsor) => {
    const sponsorValue = sponsor.value.trim();
    if (!validateLength(sponsorValue, 66, 'નિમંત્રક નું નામ')) return;
  });

  const dateValue = document.getElementById('dateInput').value;
  const timeValue = document.getElementById('timeInput').value;

  let formattedDate = '';
  let formattedTime = '';

  if (dateValue) {
    const date = new Date(dateValue);
    formattedDate = date.toLocaleDateString('gu-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  if (timeValue) {
    const [hour, minute] = timeValue.split(':');
    const time = new Date();
    time.setHours(hour);
    time.setMinutes(minute);
    formattedTime = time.toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' });
  }


  // Draw centered Date & Time
  drawCenteredText(ctx, `${formattedDate}, ${formattedTime}`, canvas.width / 3.5, 1100, 500, 24, '30px Noto Sans Gujarati', '#C62828');

  // Draw centered Address (below frame)
  drawCenteredText(ctx, address, canvas.width - (canvas.width / 3.3), 1080, 500, 40, '30px Noto Sans Gujarati', '#C62828');

  // Draw centered Name below photo frame
  drawCenteredText(ctx, `સ્વ. ${name}`, canvas.width / 2, 850, canvas.width - 200, 26, 'bold 36px Noto Sans Gujarati', '#C62828');

  // Draw centered Sponsors at bottom
  let y = 1250;
  sponsors.forEach((s) => {
    drawCenteredText(ctx, s.value, canvas.width / 2, y, canvas.width - 200, 50, '30px Noto Sans Gujarati', '#6D4C41');
    y += 50;
  });

  // Draw Photo inside frame
  const photoInput = document.getElementById('photoInput').files[0];
  if (photoInput) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 508, 318, 215, 310);
        if (callback) callback();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(photoInput);
  } else {
    if (callback) callback();
  }
}

function previewImage() {
  drawCanvasContent();
}

function downloadImage() {
  drawCanvasContent(() => {
    const link = document.createElement('a');
    link.download = 'invitation.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
  });
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      context.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function drawCenteredText(ctx, text, x, y, maxWidth, lineHeight, font = '20px Noto Sans Gujarati', color = 'black') {
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.fillStyle = color;

  const words = text.split(' ');
  let line = '';
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}

window.onload = () => {
  // Default time: 9:00 PM
  document.getElementById('timeInput').value = '21:00';
};


