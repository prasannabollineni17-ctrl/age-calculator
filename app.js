/**
 * Age & Date Calculator
 * Accurate calendar arithmetic & clean user interface logic
 */

// Check if a year is a leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get the exact days in a given month (monthIndex: 0 = Jan, 11 = Dec)
function getDaysInMonth(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

// Calculate age breakdown in years, months, and days
function calculateAge(dobStr, targetStr) {
  const [bYear, bMonth, bDay] = dobStr.split('-').map(Number);
  const [tYear, tMonth, tDay] = targetStr.split('-').map(Number);

  const dobUtc = Date.UTC(bYear, bMonth - 1, bDay);
  const targetUtc = Date.UTC(tYear, tMonth - 1, tDay);

  if (targetUtc < dobUtc) {
    return { error: 'Selected date cannot be earlier than Date of Birth.' };
  }

  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    // Borrow days from previous month of target date
    let prevMonthYear = tYear;
    let prevMonthIndex = tMonth - 2;
    if (prevMonthIndex < 0) {
      prevMonthIndex = 11;
      prevMonthYear -= 1;
    }
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthIndex);
    days += daysInPrevMonth;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const msDiff = targetUtc - dobUtc;
  const totalDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    bYear,
    bMonth,
    bDay,
    tYear,
    tMonth,
    tDay,
    dobUtc,
    targetUtc
  };
}

// Calculate upcoming birthday relative to reference date
function calculateNextBirthday(bYear, bMonth, bDay, rYear, rMonth, rDay) {
  const refUtc = Date.UTC(rYear, rMonth - 1, rDay);

  function getBirthdayUtc(year) {
    let day = bDay;
    if (bMonth === 2 && bDay === 29 && !isLeapYear(year)) {
      day = 28; // non-leap year celebration
    }
    return {
      year,
      month: bMonth,
      day,
      utc: Date.UTC(year, bMonth - 1, day)
    };
  }

  let candidate = getBirthdayUtc(rYear);
  if (candidate.utc < refUtc) {
    candidate = getBirthdayUtc(rYear + 1);
  }

  const daysRemaining = Math.round((candidate.utc - refUtc) / (1000 * 60 * 60 * 24));
  const candidateDateObj = new Date(candidate.utc);
  const weekday = candidateDateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const formattedDate = candidateDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return {
    daysRemaining,
    weekday,
    formattedDate,
    isToday: daysRemaining === 0
  };
}

// Accurate Western Tropical Zodiac Sign
function getZodiacSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'Aries ♈ (Mar 21 – Apr 19)';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'Taurus ♉ (Apr 20 – May 20)';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'Gemini ♊ (May 21 – Jun 20)';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'Cancer ♋ (Jun 21 – Jul 22)';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'Leo ♌ (Jul 23 – Aug 22)';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'Virgo ♍ (Aug 23 – Sep 22)';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'Libra ♎ (Sep 23 – Oct 22)';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'Scorpio ♏ (Oct 23 – Nov 21)';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'Sagittarius ♐ (Nov 22 – Dec 21)';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'Capricorn ♑ (Dec 22 – Jan 19)';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'Aquarius ♒ (Jan 20 – Feb 18)';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'Pisces ♓ (Feb 19 – Mar 20)';
  }
  return 'Unknown';
}

// Day of week born on
function getDayOfWeek(utcMs) {
  const d = new Date(utcMs);
  return d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

// Date string formatter
function formatDateString(isoStr) {
  if (!isoStr) return '';
  const [year, month, day] = isoStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// DOM Setup
document.addEventListener('DOMContentLoaded', () => {
  const dobInput = document.getElementById('dobInput');
  const targetDateInput = document.getElementById('targetDateInput');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorAlert = document.getElementById('errorAlert');

  const resultsSection = document.getElementById('resultsSection');
  const birthdayBanner = document.getElementById('birthdayBanner');
  const futureBanner = document.getElementById('futureBanner');
  const futureDateLabel = document.getElementById('futureDateLabel');
  const resultTypeBadge = document.getElementById('resultTypeBadge');

  const yearsVal = document.getElementById('yearsVal');
  const monthsVal = document.getElementById('monthsVal');
  const daysVal = document.getElementById('daysVal');
  const ageSentence = document.getElementById('ageSentence');

  const totalDaysVal = document.getElementById('totalDaysVal');
  const totalDaysSub = document.getElementById('totalDaysSub');
  const nextBirthdayDays = document.getElementById('nextBirthdayDays');
  const nextBirthdaySub = document.getElementById('nextBirthdaySub');
  const totalWeeksVal = document.getElementById('totalWeeksVal');
  const totalHoursVal = document.getElementById('totalHoursVal');
  const totalMinutesVal = document.getElementById('totalMinutesVal');

  const zodiacText = document.getElementById('zodiacText');
  const bornDayOfWeek = document.getElementById('bornDayOfWeek');

  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');
  const presetButtons = document.querySelectorAll('.preset-buttons .preset-btn');

  // Initialize target date with Today
  const todayStr = getTodayString();
  targetDateInput.value = todayStr;

  function performCalculation() {
    const dob = dobInput.value;
    const target = targetDateInput.value;

    errorAlert.style.display = 'none';
    errorAlert.textContent = '';

    if (!dob) {
      resultsSection.style.display = 'none';
      return;
    }

    if (!target) {
      showError('Please select a target date.');
      return;
    }

    const res = calculateAge(dob, target);
    if (res.error) {
      showError(res.error);
      resultsSection.style.display = 'none';
      return;
    }

    const isTodayTarget = target === todayStr;
    const isFutureTarget = target > todayStr;

    if (isFutureTarget) {
      resultTypeBadge.textContent = 'Projected Age';
      futureBanner.style.display = 'block';
      futureDateLabel.textContent = formatDateString(target);
    } else {
      resultTypeBadge.textContent = isTodayTarget ? 'Current Age' : 'Age on Date';
      futureBanner.style.display = 'none';
    }

    // Set numbers
    yearsVal.textContent = res.years;
    monthsVal.textContent = res.months;
    daysVal.textContent = res.days;

    const yText = res.years === 1 ? '1 year' : `${res.years} years`;
    const mText = res.months === 1 ? '1 month' : `${res.months} months`;
    const dText = res.days === 1 ? '1 day' : `${res.days} days`;

    if (isFutureTarget) {
      ageSentence.textContent = `On ${formatDateString(target)}, you will be ${yText}, ${mText}, and ${dText} old.`;
    } else {
      ageSentence.textContent = `You are ${yText}, ${mText}, and ${dText} old.`;
    }

    // Stats
    totalDaysVal.textContent = res.totalDays.toLocaleString();
    totalDaysSub.textContent = `calendar days as of ${formatDateString(target)}`;
    totalWeeksVal.textContent = res.totalWeeks.toLocaleString();
    totalHoursVal.textContent = res.totalHours.toLocaleString();
    totalMinutesVal.textContent = `${res.totalMinutes.toLocaleString()} minutes`;

    // Next Birthday
    const nextBday = calculateNextBirthday(
      res.bYear, res.bMonth, res.bDay,
      res.tYear, res.tMonth, res.tDay
    );

    if (nextBday.isToday) {
      birthdayBanner.style.display = 'block';
      nextBirthdayDays.textContent = 'Today! 🎂';
      nextBirthdaySub.textContent = `Falling on ${nextBday.weekday}`;
    } else {
      birthdayBanner.style.display = 'none';
      nextBirthdayDays.textContent = `${nextBday.daysRemaining} days`;
      nextBirthdaySub.textContent = `${nextBday.weekday}, ${nextBday.formattedDate}`;
    }

    // Zodiac & day born
    zodiacText.textContent = getZodiacSign(res.bMonth, res.bDay);
    bornDayOfWeek.textContent = getDayOfWeek(res.dobUtc);

    resultsSection.style.display = 'block';
  }

  function showError(msg) {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  }

  function shiftDateYears(yearsToAdd) {
    const base = new Date();
    base.setFullYear(base.getFullYear() + yearsToAdd);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Preset Buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-preset');

      if (preset === 'today') {
        targetDateInput.value = todayStr;
      } else if (preset === 'plus1y') {
        targetDateInput.value = shiftDateYears(1);
      } else if (preset === 'plus5y') {
        targetDateInput.value = shiftDateYears(5);
      } else if (preset === 'plus10y') {
        targetDateInput.value = shiftDateYears(10);
      } else if (preset === 'retirement') {
        if (dobInput.value) {
          const [bYear, bMonth, bDay] = dobInput.value.split('-');
          targetDateInput.value = `${Number(bYear) + 60}-${bMonth}-${bDay}`;
        } else {
          showError('Please select your Date of Birth first to calculate Age 60.');
          return;
        }
      }

      performCalculation();
    });
  });

  // Event Listeners
  dobInput.addEventListener('change', performCalculation);
  targetDateInput.addEventListener('change', () => {
    presetButtons.forEach(b => b.classList.remove('active'));
    performCalculation();
  });

  calculateBtn.addEventListener('click', performCalculation);

  resetBtn.addEventListener('click', () => {
    dobInput.value = '';
    targetDateInput.value = todayStr;
    errorAlert.style.display = 'none';
    resultsSection.style.display = 'none';
    presetButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-preset="today"]')?.classList.add('active');
  });

  // Copy Summary
  copyBtn.addEventListener('click', () => {
    const dob = dobInput.value;
    const target = targetDateInput.value;
    if (!dob || !target) return;

    const summary = [
      `Age & Date Calculator Summary`,
      `-----------------------------`,
      `Date of Birth: ${formatDateString(dob)}`,
      `Selected Date: ${formatDateString(target)}`,
      `Exact Age:     ${yearsVal.textContent} Years, ${monthsVal.textContent} Months, ${daysVal.textContent} Days`,
      `Total Days:    ${totalDaysVal.textContent} days`,
      `Total Weeks:   ${totalWeeksVal.textContent} weeks`,
      `Total Hours:   ${totalHoursVal.textContent} hours`,
      `Next Birthday: In ${nextBirthdayDays.textContent} (${nextBirthdaySub.textContent})`,
      `Zodiac Sign:   ${zodiacText.textContent}`,
      `Born On:       ${bornDayOfWeek.textContent}`
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      showToast('Summary copied to clipboard!');
    }).catch(() => {
      showToast('Could not copy to clipboard.');
    });
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }
});
