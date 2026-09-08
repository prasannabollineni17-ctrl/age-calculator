// test_calculations.js
// Unit tests for Age & Date Calculator core logic

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(year, monthIndex) {
  // monthIndex: 0 = Jan, 1 = Feb, ..., 11 = Dec
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function calculateAge(dobStr, targetStr) {
  const [bYear, bMonth, bDay] = dobStr.split('-').map(Number);
  const [tYear, tMonth, tDay] = targetStr.split('-').map(Number);

  const dobUtc = Date.UTC(bYear, bMonth - 1, bDay);
  const targetUtc = Date.UTC(tYear, tMonth - 1, tDay);

  if (targetUtc < dobUtc) {
    return { error: 'Target date must be on or after Date of Birth' };
  }

  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    // Borrow days from previous month of target date
    let prevMonthYear = tYear;
    let prevMonthIndex = tMonth - 2; // 0-based
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
    totalMinutes
  };
}

function calculateNextBirthday(dobStr, referenceDateStr) {
  const [bYear, bMonth, bDay] = dobStr.split('-').map(Number);
  const [rYear, rMonth, rDay] = referenceDateStr.split('-').map(Number);

  const refUtc = Date.UTC(rYear, rMonth - 1, rDay);

  function getBirthdayDate(year) {
    let day = bDay;
    if (bMonth === 2 && bDay === 29 && !isLeapYear(year)) {
      day = 28; // celebrated on Feb 28 in non-leap years
    }
    return {
      year,
      month: bMonth,
      day,
      utc: Date.UTC(year, bMonth - 1, day)
    };
  }

  let candidate = getBirthdayDate(rYear);
  if (candidate.utc < refUtc) {
    candidate = getBirthdayDate(rYear + 1);
  }

  const daysRemaining = Math.round((candidate.utc - refUtc) / (1000 * 60 * 60 * 24));
  const candidateDateObj = new Date(candidate.utc);
  const weekday = candidateDateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

  return {
    nextBirthdayDate: `${candidate.year}-${String(candidate.month).padStart(2, '0')}-${String(candidate.day).padStart(2, '0')}`,
    daysRemaining,
    weekday,
    isToday: daysRemaining === 0
  };
}

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

// Test Runner
const tests = [
  {
    name: 'Standard Age Calculation',
    run: () => {
      const res = calculateAge('1990-05-15', '2026-09-08');
      if (res.years !== 36 || res.months !== 3 || res.days !== 24) {
        throw new Error(`Expected 36y 3m 24d, got ${res.years}y ${res.months}m ${res.days}d`);
      }
      if (res.totalDays !== 13265) {
        throw new Error(`Expected 13265 total days, got ${res.totalDays}`);
      }
    }
  },
  {
    name: 'Same Day (Born Today)',
    run: () => {
      const res = calculateAge('2026-09-08', '2026-09-08');
      if (res.years !== 0 || res.months !== 0 || res.days !== 0 || res.totalDays !== 0) {
        throw new Error(`Expected 0 across all fields, got ${JSON.stringify(res)}`);
      }
    }
  },
  {
    name: 'Leap Year DOB (Feb 29)',
    run: () => {
      const res = calculateAge('2000-02-29', '2001-02-28');
      if (res.years !== 0 || res.months !== 11 || res.days !== 30) {
        throw new Error(`Expected 0y 11m 30d, got ${res.years}y ${res.months}m ${res.days}d`);
      }
      if (res.totalDays !== 365) {
        throw new Error(`Expected 365 total days, got ${res.totalDays}`);
      }
    }
  },
  {
    name: 'Month-end Transition (Jan 31 to Feb 28)',
    run: () => {
      const res = calculateAge('2021-01-31', '2021-02-28');
      if (res.years !== 0 || res.months !== 0 || res.days !== 28) {
        throw new Error(`Expected 0y 0m 28d, got ${res.years}y ${res.months}m ${res.days}d`);
      }
      if (res.totalDays !== 28) {
        throw new Error(`Expected 28 total days, got ${res.totalDays}`);
      }
    }
  },
  {
    name: 'Target in Future (Age on Future Date)',
    run: () => {
      const res = calculateAge('2000-01-01', '2050-01-01');
      if (res.years !== 50 || res.months !== 0 || res.days !== 0) {
        throw new Error(`Expected 50y 0m 0d, got ${res.years}y ${res.months}m ${res.days}d`);
      }
    }
  },
  {
    name: 'Next Birthday When Birthday is Today',
    run: () => {
      const res = calculateNextBirthday('1995-09-08', '2026-09-08');
      if (!res.isToday || res.daysRemaining !== 0) {
        throw new Error(`Expected isToday = true and 0 days, got ${JSON.stringify(res)}`);
      }
      if (res.weekday !== 'Tuesday') {
        throw new Error(`Expected Tuesday, got ${res.weekday}`);
      }
    }
  },
  {
    name: 'Next Birthday Later this Year',
    run: () => {
      const res = calculateNextBirthday('1995-12-25', '2026-09-08');
      if (res.isToday || res.daysRemaining <= 0) {
        throw new Error(`Expected > 0 days remaining, got ${res.daysRemaining}`);
      }
      if (res.nextBirthdayDate !== '2026-12-25') {
        throw new Error(`Expected 2026-12-25, got ${res.nextBirthdayDate}`);
      }
    }
  },
  {
    name: 'Next Birthday Already Passed this Year (rolls to next year)',
    run: () => {
      const res = calculateNextBirthday('1995-01-10', '2026-09-08');
      if (res.nextBirthdayDate !== '2027-01-10') {
        throw new Error(`Expected 2027-01-10, got ${res.nextBirthdayDate}`);
      }
    }
  },
  {
    name: 'Target Date Before DOB (Error Validation)',
    run: () => {
      const res = calculateAge('2026-09-08', '2020-01-01');
      if (!res.error) {
        throw new Error(`Expected error, got ${JSON.stringify(res)}`);
      }
    }
  },
  {
    name: 'Accurate Zodiac Sign Cusp Boundaries',
    run: () => {
      const tests = [
        { m: 1, d: 19, expected: 'Capricorn' },
        { m: 1, d: 20, expected: 'Aquarius' },
        { m: 2, d: 18, expected: 'Aquarius' },
        { m: 2, d: 19, expected: 'Pisces' },
        { m: 3, d: 20, expected: 'Pisces' },
        { m: 3, d: 21, expected: 'Aries' },
        { m: 4, d: 19, expected: 'Aries' },
        { m: 4, d: 20, expected: 'Taurus' },
        { m: 5, d: 20, expected: 'Taurus' },
        { m: 5, d: 21, expected: 'Gemini' },
        { m: 6, d: 20, expected: 'Gemini' },
        { m: 6, d: 21, expected: 'Cancer' },
        { m: 7, d: 22, expected: 'Cancer' },
        { m: 7, d: 23, expected: 'Leo' },
        { m: 8, d: 22, expected: 'Leo' },
        { m: 8, d: 23, expected: 'Virgo' },
        { m: 9, d: 22, expected: 'Virgo' },
        { m: 9, d: 23, expected: 'Libra' },
        { m: 10, d: 22, expected: 'Libra' },
        { m: 10, d: 23, expected: 'Scorpio' },
        { m: 11, d: 21, expected: 'Scorpio' },
        { m: 11, d: 22, expected: 'Sagittarius' },
        { m: 12, d: 21, expected: 'Sagittarius' },
        { m: 12, d: 22, expected: 'Capricorn' }
      ];

      for (const t of tests) {
        const sign = getZodiacSign(t.m, t.d);
        if (!sign.startsWith(t.expected)) {
          throw new Error(`For ${t.m}/${t.d}, expected ${t.expected}, got ${sign}`);
        }
      }
    }
  }
];

let passed = 0;
for (const t of tests) {
  try {
    t.run();
    console.log(`[PASS] ${t.name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${t.name}:`, err.message);
  }
}

console.log(`\nTests passed: ${passed}/${tests.length}`);
if (passed !== tests.length) process.exit(1);
