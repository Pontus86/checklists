#!/usr/bin/env python3

import tkinter as tk
from tkinter import filedialog
import subprocess

class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.pack()
        self.create_widgets()

    def create_widgets(self):
        self.select_dir_button = tk.Button(self)
        self.select_dir_button["text"] = "Select directory"
        self.select_dir_button["command"] = self.select_directory
        self.select_dir_button.pack(side="top")

        self.run_script_button = tk.Button(self)
        self.run_script_button["text"] = "Run script"
        self.run_script_button["command"] = self.run_script
        self.run_script_button.pack(side="bottom")

    def select_directory(self):
        self.directory = filedialog.askdirectory()

    def run_script(self):
        script_path = self.directory + "/launcher.sh"
        subprocess.call(script_path)

root = tk.Tk()
app = Application(master=root)
app.mainloop()
