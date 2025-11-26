#!/usr/bin/python3

import sys
import integrate_res_in_html
import os

workdir = os.getcwd()
projectRootPath = workdir

if __name__ == '__main__':
    integrate_res_in_html.integrate(projectRootPath)